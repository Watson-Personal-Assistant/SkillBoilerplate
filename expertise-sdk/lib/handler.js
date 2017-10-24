/*
© Copyright IBM Corp. 2017
*/


'use strict';

const i18 = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');
const Request = require('./request');
const Response = require('./response');
const context = require('./context');
const logger = require('./logger');

var Handler = function() {
  this.states = {};
};

Handler.prototype.initialize = function(callback) {
  callback();
};

Handler.prototype.handleRequest = function(request, callback) {
  logger.info('Request', {request});
  // State and session context for short access
  this.state = request.context.session.attributes.state;
  this.attributes = request.context.session.attributes;
  // Restore private expertise context
  context.restoreBeforeRequest(request, (err, doc) => {
    // Update language
    i18.changeLanguage(request.language);
    // The response called on save or end
    let response = new Response((err, result) => {
      // Store private expertise context
      context.storeAfterResponse(request, {}, (err, result) => {
        // Put the state back
        request.context.session.attributes.state = this.state;
        // Returned context
        Object.assign(response.response, {
          context: {
            application: request.context.application,
            session: request.context.session
          }
        });
        // Log the response
        logger.info('Response', response.response);
        // Return the response
        callback(err, response.response);
      });
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
        action(request, response);
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
  });
};

Handler.prototype.createActionsHandler = function(actions, state = 'DEFAULT') {
  return {
    actions: actions,
    state: state
  };
};

Handler.prototype.registerActionsHandler = function(...handlers) {
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

Handler.prototype.registerLanguages = function(languages) {
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

Handler.prototype.t = function(text) {
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

module.exports = Handler;
