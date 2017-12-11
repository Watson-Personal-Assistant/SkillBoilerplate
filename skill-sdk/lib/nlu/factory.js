/*
© Copyright IBM Corp. 2017
*/


/* jshint expr:true */

'use strict';

const reflect = require('promise-reflect');
const logger = require('../logger');
const {getSupported} = require('./supported');
const errors = require('../error-responses');

/**
 * Factory for creating NLU engines. The NLU engines that can be created by
 * this factory should be suppoorted by the core. ALl NLU engines should exists
 * in folder .../bundles/nlu.
 */
class Factory {

    /**
     * Create a single NLU engine from the specifed type. If the specified is not
     * supported, the function rejects the promise.
     *
     * @param  {string} url  Expertise URL
     * @param  {string} type NLU engine type
     * @param  {string} name Expertise name
     * @return {Object}      NLU engine
     */
    static create(url, type, name) {
        return new Promise(function (resolve, reject) {
            if (getSupported().indexOf(type) !== -1) {
                const Nlu = require(`bundles/engines/${type}/nlu`);
                const engineData = require(`../../res/nlu/${type}.json`);
                const engine = new Nlu(name);
                if (Nlu)
                    engine.init(engineData).then(resolve).catch(reject);
            }
            else {
                // Not a valid NLU type
                logger.warn(`Invalid nlu ${type} type for ${name} skill`);
                reject(errors.invalidNLUType);
            }
        });
    }

    /**
     * Create all NLU engines. The function will use the specified URL to query
     * NLU data.
     * The function always resolve with the created engines, empty if none was
     * created.
     *
     * @param  {string} url  Expertise URL
     * @param  {string} name Expertise name
     * @return {Array}       Created NLU engines. Empty if no engine was created.
     */
    static createAll(url, types, name) {
        return new Promise(function (resolve, reject) {
            var promises = [];
            // Use supported if not defined. Type will be validate on create.
            if (types === undefined) {
                logger.warn(`${name} doesn't specify nlu types`);
                types = getSupported();
            }

            types.forEach(function (type) {
                promises.push(Factory.create(url, type, name));
            });
            Promise.all(promises.map(reflect)).then(function (results) {
                const engines = [];
                results.forEach(function (result) {
                    (result.status === 'resolved') && engines.push(result.data);
                });
                resolve(engines);
            });
        });
    }
}

module.exports = Factory;
