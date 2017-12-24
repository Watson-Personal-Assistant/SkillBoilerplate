/*
© Copyright IBM Corp. 2017
*/


'use strict';

const ErrorCodes = require('./response-codes');

function Response(callback) {
  this.callback = callback;
  this.response = {
    reject: false,
    error: ErrorCodes.ok,
    deleteSkillSession: true,
    captureInput: false,
    speech: {
    },
    context: {
    }
  };
}

Response.prototype.say = function(text, selection = 'all') {
    if (text instanceof Array) {
        if (typeof selection === 'string') {
          let res;
            switch (selection) {
                case 'random':
                    selection = Math.floor(Math.random() * text.length);
                    res = text[selection];
                    break;
                case 'all':
                    res = text.toString();
                    break;
                default:
                    res = text;
                    break;
            }
        }
        this.response.speech.text = res;
    } else {
        if (this.response.speech.text) {
            this.response.speech.text = this.response.speech.text + ' ' + text;
        } else {
            this.response.speech.text = text;
        }
    }
    return this;
};

Response.prototype.expressiveness = function(expressiveness = 'normal') {
  this.response.speech.expressiveness = expressiveness;
  return this;
};

Response.prototype.card = function(type, content) {
  this.response.card = {
    type: type,
    content: content
  };
  return this;
};

Response.prototype.error = function(error) {
  this.response.error = error;
  return this;
};

Response.prototype.deleteSkillSession = function(end = true) {
  this.response.deleteSkillSession = end;
  return this;
};

Response.prototype.captureInput = function(capture = true) {
  this.response.captureInput = capture;
  return this;
};

Response.prototype.releaseInput = function() {
  if (this.response.captureInput === true) {
    this.response.captureInput = false;
  }
  return this;
};

Response.prototype.reject = function() {
  this.response.reject = true;
  return this;
};

Response.prototype.from = function(state, intent) {
  this.state = state;
  this.intent = intent;
};

Response.prototype.next = function(state) {
  this.state = state;
};

Response.prototype.save = function() {
};

Response.prototype.send = function() {
  if (this.state === undefined) {
    this.callback(this.response);
  }
};

Response.prototype.end = function() {
  this.releaseInput();
  this.deleteSkillSession(true);
  return this.send();
};

module.exports = Response;
