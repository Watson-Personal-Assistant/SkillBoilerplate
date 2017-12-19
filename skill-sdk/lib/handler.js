/*
© Copyright IBM Corp. 2017
*/


'use strict';

const i18 = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');
const Response = require('./response');
const logger = require('./logger');
const Conversation = require('watson-developer-cloud/conversation/v1');
const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');
const async = require('async');


let Handler = function () {
    this.states = {};
};

/**
 * Initializes the handler, sets up the connection to wcs
 */
Handler.prototype.initialize = function () {
    let rawJson = fs.readFileSync(path.join(process.cwd(), '/res/nlu') + '/wcs.json');
    this.wcsCredentials = JSON.parse(rawJson);
    if (this.wcsCredentials) {
        let credentials = this.wcsCredentials.credentials;
        setupWcs(this, credentials.url, credentials.username, credentials.password, credentials.version_date)
    }
};

Handler.prototype.handleRequest = function (request, callback) {
    logger.info('Request', {request});
    // State and session context for short access
    let skillContext = {};
    if(request.context.session.skill && request.context.session.skill.attributes) {
        skillContext = request.context.session.skill.attributes;
    }
    let context = {
        utterance: request.context.application.attributes,
        session: request.context.session.attributes,
        skill: skillContext
    };
    this.state = request.context.session.attributes.state;
    // Update language
    i18.changeLanguage(request.language);
    let response = new Response((err, result) => {
        request.context.session.attributes.state = this.state;
        let sessionContext = {
            skill: {
                attributes: context.skill
            },
            attributes: context.session
        };
        // Returned context
        Object.assign(response.response, {
            context: {
                application: request.context.application,
                session: sessionContext
            }
        });
        // Log the response
        logger.info('Response', response.response);
        // Return the response
        callback(err, response.response);
    });
    // Handle intent
    try {
        // Last state
        let state = this.state || 'DEFAULT';
        let intent = request.attributes.intent;
        do {
            // Get action from state
            const action = this.states[state].actions[intent] ||
                this.states[state].actions.unhandled;
            // Run action
            action(request, response, context);
            // Update state
            this.state = response.state || this.state;
            // Next state or stop (we have the response)
            state = response.state;
            intent = response.intent || intent;
            // Clear, will be set by next action call.
            delete response.state;
            delete response.intent;
        } while (state !== undefined);
    } catch (err) {
        callback('fail to run action or not exists');
    }
};

Handler.prototype.createActionsHandler = function (actions, state = 'DEFAULT') {
    return {
        actions: actions,
        state: state
    };
};

Handler.prototype.registerActionsHandler = function (...handlers) {
    for (let handler of handlers) {
        if (this.states[handler.state] === undefined) {
            logger.debug(`Add actions for state ${handler.state}`);
            this.states[handler.state] = {
                actions: handler.actions
            };
        } else {
            logger.error(`Actions state ${handler.state} already exist`);
        }
    }
};

Handler.prototype.registerLanguages = function (languages) {
    this.languages = languages;
    if (this.languages) {
        i18.use(sprintf).init({
            lng: 'en-US',
            overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
            resources: languages
        }, (err, t) => {
            if (err) {
                logger.error(`Failed to register languages: ${err}`);
            }
        });
    }
};

/**
 * use this function to send a message to wcs
 *
 * @param request - the request to be sent to wcs
 * @param response - the response variable
 * @param callback - callback function to handle the result from wcs
 */
Handler.prototype.converse = function (request, response, context, callback) {
    callConversation(this, request, context.skill).then(result => {
        // Save the context of the watson conversation service
        context.skill = result.context;
        callback(result, response, context, undefined);
    }).catch(err => {
        callback(undefined, response, context, err);
    });
};


Handler.prototype.t = function (text) {
    if (this.languages) {
        if (Array.isArray(text)) {
            let results = [];
            for (let t of text) {
                results.push(this.t(t));
            }
            return results;
        } else {
            return i18.t.apply(i18, arguments);
        }
    }
    return text;
};

Handler.prototype.getIntent = function (request, cb) {

    // Build the order
    var tasks = [];
    this.engines.forEach(nlu => {
        tasks.push(callback => {
            nlu.process(request, (err, result) => {
                callback(null, result);
            });
        });
    });
    // Extract intent / entities and filter
    async.parallel(tasks, (err, results) => {
        results = results.filter(intentity => {
            return this.filterIntent(request, intentity);
        });
        cb(null, results);
    });
};


/**
 * Filter intents based on intent type definitions. Function is a predicate, to test each
 * intent. Return true to keep the element, false otherwise.
 * Altough part of the filtering can be seen as nlu processing, it is currently not
 * consider as such as the filtering doesn't mean extracting intent nor entities, just
 * filtering between intents.
 */
Handler.prototype.filterIntent = function (request, intentity) {
    // If no intents
    if (intentity.intents.length === 0) {
        return false;
    }
    // Intent confidence must be above expertise threshold
    if (intentity.getIntentConfidence() < this.manifest.threshold) {
        return false;
    }
    // Intents filtering
    const intent = this.manifest.intents[intentity.getIntentName()];
    if (intent !== undefined) {
        // Visibility check
        if (intent.visibility === 'hidden') {
            return false;
        }
        // Entities fullfilment
        if (intent.entities) {
            for (const entity of intent.entities) {
                if (entity.required) {
                    if (!intentity.getEntity(entity.name)) {
                        return false;
                    }
                }
            }
        }
    }
    return true;
};
module.exports = Handler;

/**
 * sets up your WCS credentials, these will be used to access your
 * WCS service
 *
 * @param wcsUrl - your wcs url, for US: https://gateway.watsonplatform.net/conversation/api
 *                               for Germany: https://gateway-fra.watsonplatform.net/conversation/api
 * @param wcsUsername - your wcs username
 * @param wcsPassword - your wcs password
 * @param versionDate - your wcs version date
 */
let setupWcs = function (self, wcsUrl, wcsUsername, wcsPassword, versionDate) {
    try {
        self.conversation = Promise.promisifyAll(
            new Conversation({
                url: wcsUrl,
                username: wcsUsername,
                password: wcsPassword,
                version_date: versionDate
            })
        );
    } catch (err) {
        console.error('Conversation service failure or missing credentials.');
        console.log(err);
        process.exit(0);
    }
};

/**
 * a helper function for conversing with wcs
 */
let callConversation = function (self, request, skillContext) {
    let language = Object.keys(self.wcsCredentials.workspace)[0];
    const payload = {
        workspace_id: self.wcsCredentials.workspace[language].workspace_id,
        context: skillContext,
        input: {text: request.retext}
    };
    // Send the input to the conversation service and return the answer to the callback function
    return self.conversation.messageAsync(payload);
};

