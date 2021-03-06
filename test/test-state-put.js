//
// Test PUT for STATE
//

var should = require('should');
var client = require('./helpers/client.js');
var server = require('./helpers/server.js');
var fixtures = require('./helpers/fixtures.js');
var db = require('../data/db-memory.js');

describe('State API', function() {
  describe('Put',function() {

    before(function(done) {
      server.start(done);
    });

    after(function(done) {
      server.stop(done);
    });

    describe('Invalid Registration', function() {

      var data;
      var result;
      var reg;

      before(function(done) {

        data = fixtures.registrationWithStates();
        reg = data.registration;

        client.putState('bogus-reg-id', 'bugus-activity-id', 'bogus-state-id',
          fixtures.actor, "qqq",
          function(response) {
            result = response;
            done();
          }
        );
      });

      it('should return an 404 error', function() {
        result.should.have.property('statusCode', 404);
      });

    });


    describe('Save New State', function() {

      var data;
      var result;
      var reg;

      before(function(done) {

        data = fixtures.registrationWithStates();
        reg = data.registration;

        client.putState(data.registrationId, data.activityId, 'my-state-id', fixtures.actor,
          "my-new-state-data",
          function(response) {
            result = response;
            done();
          }
        );
      });

      it('should change the state', function() {
        result.should.have.property('statusCode', 204);
        var context = data;
        context.stateId = 'my-state-id';
        var state = db.getState(context);
        state.should.equal('my-new-state-data');
      });

    });


    describe('Overwrite Existing State', function() {

      var data;
      var result;
      var reg;

      before(function(done) {

        data = fixtures.registrationWithStates();
        reg = data.registration;

        var state = db.getState(data);
        state.should.equal('STATE-DATA-A');

        // Issue Request
        client.putState(data.registrationId, data.activityId, data.stateId, fixtures.actor,
          "replaced-state-data",
          function(response) {
            result = response;
            done();
          }
        );

      });

      it('should change the state', function() {
        result.should.have.property('statusCode', 204);
        var reg = db.getRegistration(data.registrationId);
        var state = db.getState(data);
        state.should.equal('replaced-state-data');
      });

    });

  });
});
