/*
© Copyright IBM Corp. 2017
*/


'use strict';

const {handler} = require('./lib');
const {server} = require('./lib/server');

// Server is exported for testing purposes
module.exports = {
  handler: handler,
  server: server
};
