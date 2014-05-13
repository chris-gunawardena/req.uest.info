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

		//Add listeners to all ips in the account
		for ( var i=0; i<user.userInfo.ip_addresses.length; i++ )
		{	
			if( !req.app.get('ip_'+user.userInfo.ip_addresses[i]) )//make sure you are not over riding a anoher client
			{	req.app.set( 'ip_'+user.userInfo.ip_addresses[i], req.app.get('ip_'+client_ip) );
				console.log( ('SERVER: Client ' + client_ip + ' listening to requests from ' + user.userInfo.ip_addresses[i]).yellow );
			}else{
				console.log( ('SERVER: The client ' + client_ip + ' is already listening to requests from ' + user.userInfo.ip_addresses[i]).yellow );
			}
		}

		//map user object to ip
		req.app.set( 'user_'+client_ip, user );
		for ( var i=0; i<user.userInfo.ip_addresses.length; i++ )
		{	
			req.app.set( 'user_'+user.userInfo.ip_addresses[i], user);
		}

	  res.json(req.user.userInfo);
	});

  })(req, res, next);

};