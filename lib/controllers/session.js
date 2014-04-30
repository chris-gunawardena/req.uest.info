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

      //Add listeners to all ips in the account
      var client_ip = req.header('x-forwarded-for') ? req.header('x-forwarded-for').split(',')[0] : req.connection.remoteAddress;
      for ( var i=0; i<user.userInfo.ip_addresses.length; i++ )
      { if( !req.app.get('ip_'+user.userInfo.ip_addresses[i]) )
        { console.log( ('SERVER: Client ' + client_ip + ' listening to requests from ' + user.userInfo.ip_addresses[i]).yellow );
          req.app.set( 'ip_'+user.userInfo.ip_addresses[i], req.app.get('ip_'+client_ip) );
        }
      }

      res.json(req.user.userInfo);
    });
  })(req, res, next);
};