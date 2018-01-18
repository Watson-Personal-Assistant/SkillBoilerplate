/*
© Copyright IBM Corp. 2018
*/

const Base = require('skill-sdk-nodejs').nlu;
const Intentity = require('skill-sdk-nodejs').intentity;


class Nlu extends Base {
    /**
     * constructor for the Nlu engine
     * @param name
     */
    constructor(name) {
        super(name);
    }

    /**
     * Initializes the nlu engine
     * @param resource - the content of the nlu configuration file found int res/nlu
     * @param force - deprecated
     * @returns {Promise<any>}
     */
    init(resource, force) {
        let self = this;
        return new Promise((resolve, reject) => {
            resolve(self);
        })
    }

    /**
     * evaluation function - is used to evaluate a request, this function will be called automatically by the skill
     * handler during the request evaluation
     * @param request - the request sent to the skill (usually by WA)
     * @param cb - is expected to be called with the following parameters:
     *             1. err
     *             2. an intentity object
     *             3. output/response - this is optional, this could save a call to the nlu in the actions.js file
     */
    evaluate(request, cb) {
        let confidence = request.retext === 'hello' ? 1 : 0;
        let chosenIntent = confidence === 1 ? 'hello-world' : undefined;
        let intent = {
            intent: chosenIntent,
            confidence: confidence
        };
        let intentityJson = {
            name: 'example',
            intents: [intent],
            entities: []
        };

        let intentity = new Intentity(intentityJson);
        cb(undefined, intentity);
    }
}

module.exports = Nlu;