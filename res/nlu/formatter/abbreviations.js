/*
© Copyright IBM Corp. 2017
*/


'use strict';

const util = require('util');
const Super = require('../../../skill-sdk/lib/formatter/formatter');

const map = {
  'thx': 'thanks'
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
