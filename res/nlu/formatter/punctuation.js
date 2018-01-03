/*
© Copyright IBM Corp. 2017
*/


'use strict';

const util = require('util');
const Super = require('../../../skill-sdk/lib/formatter/formatter');

var Formatter = function() {
  Super.apply(this, arguments);
};

// Inheritance
util.inherits(Formatter, Super);

Formatter.prototype.replace = function(text) {
  // Remove punctuation (/[.,\/#!$%\^&\*;:{}=\-_`~()]/)
  text = text.replace(/['.,;!'\"\?]/g, '');
  return text;
};

module.exports = new Formatter();
