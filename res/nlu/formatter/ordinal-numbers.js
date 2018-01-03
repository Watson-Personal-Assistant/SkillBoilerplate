/*
© Copyright IBM Corp. 2017
*/


'use strict';

var util = require('util');
var Super = require('../../../skill-sdk/lib/formatter/formatter');

const map = {
    '1st': 'first',
    '2nd': 'second',
    '3rd': 'third',
    '4th': 'fourth',
    '5th': 'fifth',
    '6th': 'sixth',
    '7th': 'seventh',
    '8th': 'eighth',
    '9th': 'ninth',
    '10th': 'tenth'
  };

var Formatter = function() {
  Super.apply(this, arguments);
};

// Inheritance
util.inherits(Formatter, Super);

Formatter.prototype.replace = function(text) {
    for (var key in map) {
      text = text.replace(key, map[key]);
    }
    return text;
  };

module.exports = new Formatter();
