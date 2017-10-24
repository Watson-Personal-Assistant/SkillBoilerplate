/*
© Copyright IBM Corp. 2017
*/


'use strict';

const BluebirdPromise = require('bluebird');

var Datastore = require('nedb');
const db = BluebirdPromise.promisifyAll(new Datastore(
    {filename: 'db/context', autoload: true})
);

const logger = require('../logger');

const write = (key, value) => {
    logger.debug(`Write to ${key}`);
    return db.insertAsync({key: key, value: value});
};

const read = key => {
    logger.debug(`Read from ${key}`);
    return db.findOneAsync({key: key}).then(record => {
        return BluebirdPromise.resolve((record && record.value) || {});
    });
};

const remove = key => {
    return db.removeAsync({key: key});
};

module.exports = {
    read: read,
    write: write,
    remove: remove
};
