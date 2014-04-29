'use strict';

var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    colors = require('colors');


/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./lib/config/config');
var db = mongoose.connect(config.mongo.uri, config.mongo.options);

// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  if (/(.*)\.(js$|coffee$)/.test(file)) {
    require(modelsPath + '/' + file);
  }
});

// Populate empty DB with sample data
require('./lib/config/dummydata');

// Passport Configuration
var passport = require('./lib/config/passport');

// Setup Express
var app = express();
require('./lib/config/express')(app);
require('./lib/routes')(app);

// Start server


var io = require('socket.io').listen( 
	app.listen(config.port, config.ip, function () {
	  console.log('Express server listening on %s:%d, in %s mode', config.ip, config.port, app.get('env'));
	})
);
app.set( 'io', io);
io.sockets.on('connection', function (socket) {
  //http://stackoverflow.com/questions/14382725/how-to-get-the-correct-ip-address-of-a-client-into-a-node-socket-io-app-hosted-o
  var client_ip = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address.address;
	app.set( 'ip_' + client_ip, socket );
    //socket.emit( 'message', { message: 'connected to server as ' + 'ip_' + client_ip });
    console.log( 'SERVER: Client ip_' + client_ip + ' connected to server.' );
});

// Expose app
exports = module.exports = app;