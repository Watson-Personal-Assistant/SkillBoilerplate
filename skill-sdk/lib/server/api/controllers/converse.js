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
    if (req.response) {
        res.json(req.response);
    }
    else {
        const request = req.swagger.params.input.value;
        handler.handleRequest(request, (err, result) => {
            res.json(result);
        });
    }
}
