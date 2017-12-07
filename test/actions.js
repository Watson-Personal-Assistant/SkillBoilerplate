/*
© Copyright IBM Corp. 2017
*/

'use strict';

const should = require('should');
const request = require('supertest');
const {server} = require('skill-sdk');

// Bring the actions
require('..');

describe('actions', function() {

  describe('converse', function() {

    it('intent hello-world us-EN', function(done) {

      request(server)
        .post('/v1/api/converse')
        .send({
          id: '001',
          text: 'hello world',
          retext: 'hello world',
          version: '1.0',
          language: 'en-US',
          attributes: {
            intent: 'hello-world'
          },
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
              attributes: {
              },
              version: '1.0'
            }
          }
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          res.body.should.have.property('speech');
          res.body.speech.text.should.match('Hello world');
          res.body.should.have.property('deleteSkillSession').which.be.exactly(true);
          done();
        });
    });

  });

});
