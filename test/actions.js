/*
© Copyright IBM Corp. 2017
*/

'use strict';

const should = require('should');
const request = require('supertest');
const {server} = require('skill-sdk-nodejs');
const utteranceFile = require('./utterance-tests.json');
const skillManifest = require(process.env.skillSDKResDir + '/assets/manifest');
// Bring the actions
require('..');

describe('actions', function () {

    describe('converse', function () {
        for (let test of utteranceFile.tests) {
            it('Test description: ' + test.testDescription + ', intent ' + test.intent + ' with utterance: ' + '\''
                + test.utterance + '\'' + ', should return: ' + '\'' + test.expectedResponse + '\'', function (done) {
                let attributes = {
                    "intent": test.intent
                };
                for (let entity of test.entities) {
                    attributes[entity.entity] = entity.value;
                }
                request(server)
                    .post('/v1/api/converse')
                    .send({
                        id: '001',
                        text: test.utterance,
                        retext: test.utterance,
                        version: '1.0',
                        language: 'en-US',
                        attributes: attributes,
                        context: {
                            user: {
                                id: '12345678',
                            },
                            application: {
                                id: '002',
                                attributes: {}
                            },
                            session: {
                                new: true,
                                attributes: {},
                                version: '1.0'
                            }
                        }
                    })
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.body.should.have.property('speech');
                        res.body.speech.text.should.match(test.expectedResponse);
                        done();
                    });
            });
        }
    });

});
describe('Manifest', function () {
    it('Exists', function (done) {
        request(server)
            .get('/v1/api/manifest')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                res.body.should.have.property('author');
                res.body.should.have.property('description');
                res.body.should.have.property('threshold');
                res.body.should.have.property('nlu');
                res.body.should.have.property('version');
                done();
            });
    });
});
describe('NLU', function () {
    if (skillManifest.nlu.indexOf('wcs') !== -1) {
        it('wcs', function (done) {
            request(server)
                .get('/v1/api/nlu?type=wcs')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.body.should.have.property('workspace');
                    res.body.should.have.property('credentials');
                    res.body.credentials.should.have.property('url');
                    res.body.credentials.should.have.property('version');
                    res.body.credentials.should.have.property('version_date');
                    should.exist(res.body.credentials.username);
                    should.exist(res.body.credentials.password);
                    should.exist(res.body.credentials.url);
                    should.exist(res.body.credentials.version);
                    done();
                });
        });
    }
    if (skillManifest.nlu.indexOf('regexp') !== -1) {
        it('regexp', function (done) {
            request(server)
                .get('/v1/api/nlu?type=regexp')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    done();
                });
        });
    }
    it('intents', function (done) {
        request(server)
            .get('/v1/api/intents')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                done();
            });
    });
});
describe('Healthcheck', function () {
    it('Healthcheck', function (done) {
        request(server)
            .get('/v1/api/healthcheck')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);
        done();
    });
});
