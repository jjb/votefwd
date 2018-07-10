var expect = require('chai').expect;

var db = require('../server/db');
var userService = require('../server/userService');

var users = [];

describe('userService', function() {
  before(function() {
    return db('users')
      .insert([{
        auth0_id: 'test-auth0-id-0',
        full_name: 'Regular Joe'
      }, {
        auth0_id: 'test-auth0-id-1',
        full_name: 'Admin Sally',
        is_admin: true
      }])
      .returning('*')
      .tap(function(result) {
        users = result;
      });
  });

  after(function() {
    if (users && users.length) {
      console.log(`Deleting ${users.length} users`);
      return db('users')
        .whereIn('id', users.map(u => u.id))
        .del();
    }
    return Promise.resolve(true);
  });

  after(function() {
    console.log('destroying db');
    return db.destroy();
  });

  describe('isAdmin', function() {
    it('should find a non-admin', function(done) {
      userService.isAdmin(users[0].auth0_id, function(error, isAdmin) {
        if (error) {
          return done(error);
        }
        expect(isAdmin).to.be.false;
        done();
      });
    });

    it('should find an admin', function(done) {
      userService.isAdmin(users[1].auth0_id, function(error, isAdmin) {
        if (error) {
          return done(error);
        }
        expect(isAdmin).to.be.true;
        done();
      });
    });

    it('should consider missing user not an admin', function(done) {
      userService.isAdmin(users[0].auth0_id + 'MISSING', function(error, isAdmin) {
        if (error) {
          return done(error);
        }
        expect(isAdmin).to.be.false;
        done();
      });
    });
  });
});
