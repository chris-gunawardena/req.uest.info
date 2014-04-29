'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Thing = mongoose.model('Thing');

/**
 * Populate database with sample application data
 */

// Clear old users, then add a default user
User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test',
    ip_addresses: [
      '123.123.123.1',
      '123.123.123.2',
      '123.123.123.3',
      '123.123.123.4'
    ]
  }, function() {
      console.log('finished populating users'.rainbow);
    }
  );
});
