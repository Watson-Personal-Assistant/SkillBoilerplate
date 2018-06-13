/*
© Copyright IBM Corp. 2017
*/


'use strict';

// Initialize handler
const {handler} = require('skill-sdk-nodejs');
const manifest = require('./res/assets/manifest.json');
const factory = require('skill-sdk-nodejs').factory;

// Expertise configuration
require('dotenv').config();


//initialize wcs in handler
if(manifest.nlu.indexOf('wcs') > -1) {
    handler.initialize();
}
let newManifest = JSON.parse(JSON.stringify(manifest));
let index = newManifest.nlu.indexOf('skill');
if(index !== -1) {
    newManifest.nlu.splice(index, 1);
}
if (newManifest.nlu.length < 1) {
    console.error('No Nlu engines selected, you need to add the nlu engines you want to use to manifest.json nlu field')
} else {
    factory.getNLUs(newManifest).then(updatedManifest => {
        if (updatedManifest.nlu.regexp) {
            updatedManifest.intents = require('./res/nlu/intents');
        }
        handler.manifest = updatedManifest;
        factory.createAll(updatedManifest).then(function (engines) {
            handler.engines = engines;
        });
    });
}

// The expertise handler
require('./actions')();
