/*
© Copyright IBM Corp. 2017
*/


'use strict';

const {handler} = require('../../..');
const manifest = require('../../../../../manifest');

module.exports = {
    post: post
};

function post(req, res) {
    // if we already got a suitable response from the evaluation
    if (req.response) {  //TODO need to add a call for postprocessing
        res.json(req.response);
    }
    // if the evaluation was not done in the skill
    else {
        const request = req.swagger.params.input.value;
        handler.handleRequest(request, (err, result) => {
            res.json(result);
        });
    }
}
