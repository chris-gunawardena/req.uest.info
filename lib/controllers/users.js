'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    passport = require('passport');

/**
 * Create user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.save(function(err) {
    if (err) return res.json(400, err);
    
    req.logIn(newUser, function(err) {
      if (err) return next(err);

      return res.json(req.user.userInfo);
    });
  });
};

/**
 *  Get profile of specified user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(404);

    res.send({ profile: user.profile });
  });
};

/**
 * Update user
 */
exports.update = function(req, res, next) {
  var userId = req.user._id;

  User.findById(userId, function (err, user) {

    //Change password
    var oldPass = String(req.body.oldPassword);
    var newPass = String(req.body.newPassword);
    if( req.body.oldPassword && req.body.newPassword )
    { //console.log('Updating password',oldPass,newPass);
      if(user.authenticate(oldPass)) {
        user.password = newPass;
      } else {
        res.send(403);
      }
    }

    //add IP addresss
    var new_ip = String(req.body.new_ip);
    if( req.body.new_ip &&  user.ip_addresses.indexOf(new_ip) === -1)
    { console.log('Adding new ip'.yellow);
      user.ip_addresses.push(new_ip);
    }

    var remove_ip = String(req.body.remove_ip);
    if( req.body.remove_ip && user.ip_addresses.indexOf(remove_ip) > -1 )
    {  user.ip_addresses.splice( user.ip_addresses.indexOf(remove_ip), 1 );
    }

    //Finally save
    user.save(function(err) {
      if (err) 
        return res.send(400);
      else
        res.json(user.userInfo);
    });

  });



};

/**
 * Get current user
 */
exports.me = function(req, res) {
  res.json(req.user || null);
};