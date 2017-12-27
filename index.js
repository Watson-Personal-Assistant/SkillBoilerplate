/*
© Copyright IBM Corp. 2017
*/


'use strict';

// Expertise configuration
require('dotenv').config();

// Initialize handler
const {handler} = require('skill-sdk-nodejs');
const manifest = require('./res/assets/manifest.json');
if(manifest.nlu.indexOf('wcs') > -1) {
    handler.initialize();
}

// The expertise handler
require('./actions')();
