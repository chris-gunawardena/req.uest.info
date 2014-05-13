'use strict';

var mongoose = require('mongoose'),
	passport = require('passport');

/**
 * Logout
 */
exports.logout = function (req, res) {
  req.logout();
  res.send(200);
};

/**
 * Login
 */
exports.login = function (req, res, next) {
  passport.authenticate('local', function(err, user, info) {
	var error = err || info;
	if (error) return res.json(401, error);

	req.logIn(user, function(err) {
	  
		if (err) return res.send(err);

		var client_ip = req.header('x-forwarded-for') ? req.header('x-forwarded-for').split(',')[0] : req.connection.remoteAddress;

		//For each ip in the account
		for ( var i=0; i<user.userInfo.ip_addresses.length; i++ )
		{	//check if another socket is assied to the ip
			if( req.app.get('ip_'+user.userInfo.ip_addresses[i]) )
				console.log( ('SERVER: Client ' + client_ip + ' listening to requests from ' + user.userInfo.ip_addresses[i]).yellow );
			else
				console.log( ('SERVER: The client ' + client_ip + ' was already listening to requests from ' + user.userInfo.ip_addresses[i]).red );
			
			//reassign regardless
			req.app.set( 'ip_'+user.userInfo.ip_addresses[i], req.app.get('ip_'+client_ip) );
		}

		//Assign user to ip so the requests can be saved to user object in db
		req.app.set( 'user_'+client_ip, user );
		//For each ip in the account
		for ( var i=0; i<user.userInfo.ip_addresses.length; i++ )
		{	console.log( ('SERVER: User ' + user.userInfo.name + ' saving to requests from ' + user.userInfo.ip_addresses[i]).yellow );
			req.app.set( 'user_'+user.userInfo.ip_addresses[i], user);
		}

		res.json(req.user.userInfo);
	});

  })(req, res, next);

};