/*
© Copyright IBM Corp. 2017
*/


'use strict';

const fs = require('fs');
const path = require('path');
const logger = require('../logger');

// Path to NLU engines
const PATH = __dirname + '/bundles/engines';

// Get all supported NLU types. Currently we assume that if folder exists in
// the PATH, the engine is valid and can be used.
const supported = fs.readdirSync(PATH).filter(f => fs.statSync(path.join(PATH, f)).isDirectory());
logger.info(`Supported nlu types: ${supported}`);

module.exports = {

  getSupported: function() {
    return supported;
  }
};
