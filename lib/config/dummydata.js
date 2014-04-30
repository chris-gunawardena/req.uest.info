'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User');

/**
 * Populate database with sample application data
 */

// Clear old users, then add a default user
User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Chris G',
    email: 'chris@gunawardena.id.au',
    password: 'zx',
    ip_addresses: []
  }, function() {
      console.log('finished populating users'.rainbow);
    }
  );
});
