/*
© Copyright IBM Corp. 2017
*/


'use strict';

const util = require('util');
const Super = require('../../../formatter/formatter');

const map = {
    'jan': 'january',
    'feb': 'february',
    'mar': 'march',
    'apr': 'april',
    'may': 'may',
    'jun': 'june',
    'jul': 'july',
    'aug': 'august',
    'sep ': 'september',
    'sept': 'september',
    'oct': 'october',
    'nov': 'november',
    'dec': 'december',

    'sun': 'sunday',
    'mon': 'monday',
    'tu': 'tuesday',
    'tue': 'tuesday',
    'tues': 'tuesday',
    'wed': 'wednesday',
    'th': 'thursday',
    'thu': 'thursday',
    'thur': 'thursday',
    'fri': 'friday',
    'sat': 'saturday'
  };

var Formatter = function() {
    Super.apply(this, arguments);
  };

// Inheritance
util.inherits(Formatter, Super);

Formatter.prototype.replace = function(text) {
    for (var key in map) {
      var expression = new RegExp('\\b' + key + '\\b');
      text = text.replace(expression, map[key]);
    }
    return text;
  };

module.exports = new Formatter();
