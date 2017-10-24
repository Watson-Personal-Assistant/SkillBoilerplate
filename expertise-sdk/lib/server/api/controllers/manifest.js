/*
© Copyright IBM Corp. 2017
*/


'use strict';

const logger = require('../../../logger');

module.exports = {
  get: get
};

function get(req, res) {
  var manifest = {};
  try {
    manifest = require('../../../../../manifest.json');
    res.json(manifest);
  } catch (err) {
    logger.error('failed to load manifest');
    res.status('404').json();
  }
}
