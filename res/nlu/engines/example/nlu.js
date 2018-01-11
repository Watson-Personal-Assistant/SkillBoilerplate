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

    init(resource, force) {
        let self = this;
        return new Promise((resolve, reject) => {
            resolve(self);
        })
    }

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