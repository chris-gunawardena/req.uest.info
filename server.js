'use strict';

var express = require('express'),
		path = require('path'),
		fs = require('fs'),
		mongoose = require('mongoose'),
		colors = require('colors');

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

	//index the client socket using ip adress
	//var client_ip = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address.address;
	//app.set( 'ip_' + client_ip, socket );

	//debug messages
	console.log( ('SERVER: Connected to new client').yellow );
	socket.emit( 'CLIENT_DEBUG_MSG', { message: 'Connected to server.' });

	//disconnect
	socket.on('disconnect', function () {
		console.log( ('SERVER: Disconnected from server.').yellow );

		//remove all refs in app.set
		//do we need to do this coz the socket might be set to nulll anyways? need to test

		//app.set( 'ip_' + client_ip, null );
		//for (var i=0; i<req.user.ip_addresses.length; i++)
		//{  app.set( 'ip_' + req.user.ip_addresses[i], null );
		//} 

	});

});

// Expose app
exports = module.exports = app;