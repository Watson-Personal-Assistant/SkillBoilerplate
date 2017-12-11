/*
© Copyright IBM Corp. 2017
*/


'use strict';

const util = require('util');
const Super = require('../../../formatter/formatter');
const numbered = require('numbered');

// Regular expressions for ranges of numbers
const two_digit_prefix = '(?:s(?:even|ix)|t(?:hir|wen)|f(?:if|or)|eigh|nine)ty';
const one_to_9 	       = 'four|eight|(?:fiv|(?:ni|o)n)e|t(?:wo|hree)|s(?:ix|even)';
const ten_to_19        =  '(?:(?:(?:s(?:even|ix)|f(?:our|if)|nine)te|e(?:ighte|lev))en|t(?:(?:hirte)?en|welve))';
const one_to_99        = '(two_digit_prefix)(?:[- ](one_to_9))?|(ten_to_19)|(one_to_9)';
const one_to_999       = '(one_to_9)[ ]hundred(?:[ ](?:and[ ])?(one_to_99))?|(one_to_99)';
let one_to_999_999   = '((one_to_999)[ ]thousand(?:[ ](one_to_999))?|(one_to_999))';

// Build the one_to_999_999 regular expression
one_to_999_999 = one_to_999_999
  .replace(/one_to_999/g, one_to_999)
  .replace(/\bone_to_99\b/g, one_to_99)
  .replace(/ten_to_19/g, ten_to_19)
  .replace(/two_digit_prefix/g, two_digit_prefix)
  .replace(/one_to_9/g, one_to_9);

// Create the regular experession
const regex_one_to_999_999 = new RegExp('\\b' + one_to_999_999 + '\\b');

var Formatter = function() {
  Super.apply(this, arguments);
};

// Inheritance
util.inherits(Formatter, Super);

Formatter.prototype.replace = function(text) {
  text = text.replace(regex_one_to_999_999, (match, number, offset, s) => {
    return numbered.parse(number);
  });
  return text;
};

module.exports = new Formatter();
