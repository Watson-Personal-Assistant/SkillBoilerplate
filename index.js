/*
© Copyright IBM Corp. 2017
*/


'use strict';

// Expertise configuration
require('dotenv').config();

// Initialize handler
const {handler} = require('./skill-sdk');
const manifest = require('./manifest.json');
const {getSupported} = require('./skill-sdk/lib/nlu/supported');
const factory = require('./skill-sdk/lib/nlu').factory;

//initialize wcs in handler
if(manifest.nlu.indexOf('wcs') > -1) {
    handler.initialize();
}
//in case the nlu is handled in the skill - create nlu engines
if(manifest.nlu.indexOf('skill' > -1)) {
    const supported = getSupported();
    factory.createAll(supported).then(function (engines) {
        handler.engines = engines;
    });
}

// The expertise handler
require('./actions')();
