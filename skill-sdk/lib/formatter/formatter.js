/*
© Copyright IBM Corp. 2017
*/


'use strict';

const logger = require('../logger');

var Formatter = function() {
};

Formatter.prototype.replace = function(text) {
  return text;
};

module.exports = Formatter;
