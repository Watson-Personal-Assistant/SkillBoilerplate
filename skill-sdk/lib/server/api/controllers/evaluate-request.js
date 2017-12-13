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
        if (err) {
            res.json(err);
        }
        else {
            handler.handleRequest(request, (err, requestResult) => {
                let result = {
                    requestResult: requestResult,
                    IntentConfidence: intentResult
                };
                console.log(result);
                res.json(result);
            });
        }
    });
}
