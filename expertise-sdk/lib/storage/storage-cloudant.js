/*
© Copyright IBM Corp. 2017
*/


'use strict';

const BluebirdPromise = require('bluebird');
const Cloudant = require('cloudant');

const cloudant = Cloudant(process.env.CLOUDANT_URL);
const db = BluebirdPromise.promisifyAll(cloudant.use(process.env.CLOUDANT_URL));

const logger = require('../logger');

const write = (userId, value, callback) => {
  logger.debug(`Write to ${userId}`);
  callback();
};

const read = (userId, callback) => {
  logger.debug(`Read from ${userId}`);
  callback();
};

module.exports.read = read;
module.exports.write = write;
