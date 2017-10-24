/*
© Copyright IBM Corp. 2017
*/


'use strict';

const storage = require('./storage');
const logger = require('./logger');

function resolve(request, response) {
  // Return the application context in the response.
  Object.assign(response.context, {application: request.context.application});
}

function restore(request, cb) {
  if (cb) {
    storage.read(request.context.user.id).then(value => {
      //logger.info(`read [${userId}]: ` + JSON.stringify(value));
      cb(null, value);
      // cb(null, Object.assign(
      //   {attributes: []}, data
      // ));
    }).catch(err => {
      cb(err);
    });
  }
}

function store(request, value, cb) {
  if (cb) {
    storage.write(request.context.user.id, value).then(() => {
      //logger.info(`write [${userId}]: ` + JSON.stringify(value));
      cb();
    }).catch(err => {
      cb(err);
    });
  }
}

module.exports = {
  resolve: resolve,
  restoreBeforeRequest: restore,
  storeAfterResponse: store
};
