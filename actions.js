/*
© Copyright IBM Corp. 2017
*/


'use strict';

// The expertise handler
const {handler} = require('skill-sdk-nodejs');

const evaluation = 'evaluation';
const entities = 'entities';

// Expertise translations map
const languageResource = {
    'en-US': {
        'translation': {
            'HELLO_WORLD': 'Hello world',
            'TRY_AGAIN': 'Sorry, please try again later'
        }
    },
    'de-DE': {
        'translation': {
            'HELLO_WORLD': 'Hallo Welt',
            'TRY_AGAIN': 'Sorry, bitte versuchen Sie es später noch einmal'
        }
    }
};

/**
 *  example callback function sent to the handler.converse function, change this function to suit your needs
 * @param result - request result from WCS
 * @param response - the response variable
 * @param context - variable holding the utterance, session and updated skill context
 * @param err - error description in case of an error, otherwise undefined
 */
let converseCallback = function (result, response, context, err) {
    // this variable would preferably come from your wcs and decide whether the session has ended
    let deleteSkillSession = false;
    if (err) {
        response.say(handler.t('TRY_AGAIN')).send();
        console.error(err);
    }
    else {
        // example of adding a card
        // example of a card sent to the application, the action and the json most of the time will come from WCS
        response.card('some action', {"some": "json"});
        response.say(result.output.text).deleteSkillSession(deleteSkillSession).send();
    }
};

/**
 * example callback call for the handler.evaluationRequest function.
 * this callback is called after the nlu evaluation process.
 *
 * @param result - response from the nlu engine (could be undefined)
 * @param evaluationResponse - an evaluationResponse object containing
 *  {
 *      response: {
 *          responseCode - status of the evaluation request
 *          requestResult - the response of the nlu engine
 *          intentConfidence - the intentity object which holds the confidence for each intent/entity
 *          handleUtterance - a boolean which tells WA whether the skill would like to handle this request
 *          context - the context after the evaluation request
  *     }
 *
 *  }
 * @param context - context object containing, application, skill and session context
 * @param err
 */
let evaluationCallback = function(result, evaluationResponse, context, err) {
    if(err) {
        console.error(err);
    }
    else {
        if(!result) {
            result = ['Nlu engine did not return an output'];
        }
        evaluationResponse.send(result[0]);
    }
};

// Actions for DEFAULT state
const stateDefaultActions = handler.createActionsHandler({

    // this is an example of an intent using a regex engine, the intent catches the phrase "hello"
    'hello-world': (request, response, context) => {
        response.say(handler.t('HELLO_WORLD')).send();
    },
    //this is an example of an intent using wcs - in order for this to work you need your own wcs workspace and intents
    //and change the intents name with your own
    'hello-world-wcs': (request, response, context) => {
        handler.converse(request, response, context, converseCallback);
    },
    'unhandled': (request, response, context) => {
        response.say(handler.t('TRY_AGAIN')).send();
    },
    //pre processing before the request evaluation
    evaluation: (request, evaluationResponse, context) => {
        handler.evaluateRequest(request, evaluationResponse, context, evaluationCallback);
    },
    // pre processing for entity based routing
    entities: (request, response, context) => {
        handler.converse(request, response, context, converseCallback);
    }

}, 'DEFAULT');


module.exports = () => {
    // Register language translations.
    handler.registerLanguages(languageResource);
    // Register state actions
    handler.registerActionsHandler(stateDefaultActions);
};
