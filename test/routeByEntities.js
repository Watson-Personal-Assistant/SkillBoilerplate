/*
© Copyright IBM Corp. 2017
*/

'use strict';

const should = require('should');
const request = require('supertest');
const {server} = require('skill-sdk-nodejs');
const {handler} = require('skill-sdk-nodejs');


describe.only('Test routeByEntities flag', function () {
    this.timeout(10000);

    it('set routeByEntitiesFlag to false in manifest', function (done) {
        handler.manifest.routeByEntities = false;
        request(server)
            .post('/v1/api/evaluate')
            .send({
                id: '001',
                text: 'hello',
                version: '1.0',
                language: 'en-US',
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
            .expect(200)
            .end((err, res) => {
                should.not.exist(err);
                should.exist(res.body.routeByEntities);
                res.body.routeByEntities.should.match(false);
                done();
            })

    });

    it('set routeByEntitiesFlag to true in manifest', function (done) {
        handler.manifest.routeByEntities = true;
        request(server)
            .post('/v1/api/evaluate')
            .send({
                id: '001',
                text: 'hello',
                version: '1.0',
                language: 'en-US',
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
            .expect(200)
            .end((err, res) => {
                should.not.exist(err);
                should.exist(res.body.routeByEntities);
                res.body.routeByEntities.should.match(true);
                done();
            })
    })
});
