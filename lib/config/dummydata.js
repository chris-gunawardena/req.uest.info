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
    email: 'chris@infinitestudio.com.au',
    password: 'zx',
    ip_addresses: [],
    requests: [  
      //'{  "time": "11:10:32",  "ip_address": "127.0.0.1",     "method": "POST",     "url": "/submit/",     "headers": {        "host": "localhost:9000",     },     "body": {        "subscribe_email": "z",     },     "params": {        "0": ""    },     "query": { } }',
      //'{  "time": "22:10:32",  "ip_address": "127.0.0.1",     "method": "POST",     "url": "/submit/",     "headers": {        "host": "localhost:9000",     },     "body": {        "subscribe_email": "z",     },     "params": {        "0": ""    },     "query": { } }',
      //'{  "time": "33:10:32",  "ip_address": "127.0.0.1",     "method": "POST",     "url": "/submit/",     "headers": {        "host": "localhost:9000",     },     "body": {        "subscribe_email": "z",     },     "params": {        "0": ""    },     "query": { } }'
    ]
  }, function() {
      console.log('finished populating users'.rainbow);
    }
  );
});



