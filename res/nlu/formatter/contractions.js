/*
© Copyright IBM Corp. 2017
*/


'use strict';

const util = require('util');
const Super = require('../../../skill-sdk/lib/formatter/formatter');

const map = {
  'aren\'t': 'are not',
  'can\'t': 'cannot',
  'couldn\'t': 'could not',
  'didn\'t': 'did not',
  'doesn\'t': 'does not',
  'don\'t': 'do not',
  'hadn\'t': 'had not',
  'hasn\'t': 'has not',
  'haven\'t': 'have not',
  'he\'d ': 'he had',
  'he\'ll': 'he will',
  'he\'s': 'he is',
  'i\'d': 'i had',
  'i\'ll': 'i will',
  'i\'m': 'i am',
  'i\'ve': 'i have',
  'isn\'t': 'is not',
  'it\'s': 'it is',
  'let\'s': 'let us',
  'mightn\'t': 'might not',
  'mustn\'t': 'must not',
  'shan\'t': 'shall not',
  'she\'d': 'she had',
  'she\'ll': 'she will',
  'she\'s': 'she is',
  'shouldn\'t': 'should not',
  'that\'s': 'that is',
  'there\'s': 'there is',
  'they\'d': 'they had',
  'they\'ll': 'they will',
  'they\'re': 'they are',
  'they\'ve': 'they have',
  'we\'d': 'we had',
  'we\'re': 'we are',
  'we\'ve': 'we have',
  'weren\'t': 'were not',
  'what\'ll': 'what will',
  'what\'re': 'what are',
  'what\'s': 'what is',
  'whats': 'what is',
  'what\'ve': 'what have',
  'where\'s': 'where is',
  'who\'d': 'who had',
  'who\'ll': 'who will',
  'who\'s': 'who is',
  'who\'ve': 'who have',
  'won\'t': 'will not',
  'wouldn\'t': 'would not',
  'you\'d': 'you had',
  'you\'ll': 'you will',
  'you\'re': 'you are',
  'you\'ve': 'you have'
};

var Formatter = function() {
  Super.apply(this, arguments);
};

// Inheritance
util.inherits(Formatter, Super);

Formatter.prototype.replace = function(text) {
  for (const key in map) {
    text = text.replace(key, map[key]);
  }
  return text;
};

module.exports = new Formatter();
