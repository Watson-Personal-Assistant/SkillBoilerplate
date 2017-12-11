/*
© Copyright IBM Corp. 2017
*/


'use strict';

const util = require('util');
const Super = require('../../../formatter/formatter');

var Formatter = function() {
  Super.apply(this, arguments);
};

// Inheritance
util.inherits(Formatter, Super);

Formatter.prototype.replace = function(text) {
  // Replace math signs
  text = text.replace(/([&%+-\/\*])/g, match => {
    switch (match) {
      case '+':
        return ' plus ';
      case '-':
        return ' minus ';
      case '%':
        return ' percent ';
      case '&':
        return ' and ';
    }
    return match;
  });
  return text;
};

module.exports = new Formatter();
