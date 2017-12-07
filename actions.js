/*
© Copyright IBM Corp. 2017
*/


'use strict';

// The expertise handler
const {handler} = require('skill-sdk');

/*************************** Handler Functions ******************************
 *                                                                          *
 * ** converse -                                                            *
 *                                                                          *
 *  use this function to send a message to wcs                              *
 * @param request - the request to be sent to wcs                           *
 * @param response - the response variable to be returned to wpa            *
 * @returns result - the result from wcs                                    *
 *                                                                          *
 *                                                                          *
 * ** addToSkillContext -                                                   *
 *                                                                          *
 * Add variable to context                                                  *
 * @param varName - name of your context variable                           *
 * @param value - value of the the context variable                         *
 *                                                                          *
 * ** removeFromSkillContext -                                              *
 * Delete a variable from the context                                       *
 * @param varName - name of the variable to delete                          *
 *                                                                          *
 * ** getFromSkillContext -                                                 *
 * Get the value of a variable from the context                             *
 * @param varName - the name of the variable requested from the context     *
 * @returns the value of varName in the context                             *
 *                                                                          *
 * ** clearSkillContext -                                                   *
 * clears all the context                                                   *
 *                                                                          *
 ****************************************************************************/

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
 * @param err - error description in case of an error, otherwise undefined
 */
let converseCallback = function (result, response, err) {
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
        response.say(result.output.text, 'random').deleteSkillSession(deleteSkillSession).send();
    }
};

// Actions for DEFAULT state
const stateDefaultActions = handler.createActionsHandler({

    // this is an example of an intent using a regex engine, the intent catches the phrase "hello"
    'hello-world': (request, response) => {
        response.say(handler.t('HELLO_WORLD')).send();
    },
    //this is an example of an intent using wcs - in order for this to work you need your own wcs workspace and intents
    //and change the intents name with your own
    'hello-world-wcs': (request, response) => {
        handler.converse(request, response, converseCallback)
    },
    'unhandled': (request, response) => {
        response.say(handler.t('TRY_AGAIN')).send();
    }

}, 'DEFAULT');

module.exports = () => {
    // Register language translations.
    handler.registerLanguages(languageResource);
    // Register state actions
    handler.registerActionsHandler(stateDefaultActions);
};
