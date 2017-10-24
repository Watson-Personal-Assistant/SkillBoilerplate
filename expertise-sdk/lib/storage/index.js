/*
© Copyright IBM Corp. 2017
*/


'use strict';

const logger = require('../logger');

var storage = process.env.STORAGE || 'nedb';
logger.info(`Storage: ${storage}`);
module.exports = require(`./storage-${storage}`);
