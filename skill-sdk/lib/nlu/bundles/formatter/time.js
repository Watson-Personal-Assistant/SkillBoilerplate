/*
© Copyright IBM Corp. 2017
*/


'use strict';

const util = require('util');
const Super = require('../../../formatter/formatter');

const map = {
    'sec': 'seconds',
    'hr': 'hour',
    'min': 'minute',
    'yr': 'year'
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
