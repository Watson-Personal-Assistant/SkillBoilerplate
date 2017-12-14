/*
© Copyright IBM Corp. 2017
*/


'use strict';

const {handler} = require('../../..');

module.exports = {
    post: post
};

function post(req, res) {
    const request = req.swagger.params.input.value;
    handler.getIntent(request, (err, intentResult) => {
        let bin = [];
        for(let intentity of intentResult) {
            bin.push(intentity);
        }
        request.attributes.intent = sort(bin)[0].intents[0].intent;
        if (err) {
            res.json(err);
        }
        else {
            handler.handleRequest(request, (err, requestResult) => {
                let result = {
                    requestResult: requestResult,
                    intentConfidence: intentResult
                };
                console.log(result);
                res.json(result);
            });
        }
    });
}


/**
 * Sort intents by confidence (per bin).
 *
 * @param  {object} bins [description]
 * @return {promise}     [description]
 */
function sort(bin, compare) {
    // Default compare by intent confidence
    compare = compare || function (a, b) {
        // Sort by confidence (highest first)
        // If result is equal - prefer the last skill chosen (if exists)
        let result = b.getIntentConfidence() - a.getIntentConfidence();
        if (result === 0) {
            return (b.previousExpertise);
        } else {
            return (result)
        }
    };

    // Sort bins. Index 0 will be the top skill.
    bin.sort(compare);
    return (bin);
}