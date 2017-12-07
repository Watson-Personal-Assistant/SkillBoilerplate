/*
© Copyright IBM Corp. 2017
*/


'use strict';

const winston = require('winston');

var logger = new winston.Logger({
  level: process.env.LOGGER_LEVEL || 'info',
  rewriters: [
    (level, msg, meta) => {
      return meta;
    }
  ],
  transports: [
    new (winston.transports.Console)({
      json: false,
      timestamp: true,
      colorize: true,
      label: process.env.APP_NAME || 'expertise'
    })
  ]
});

module.exports = logger;
