'use strict';

var mongoose = require('mongoose'); //,Thing = mongoose.model('Thing');

exports.get = exports.post = exports.put = exports.del = function(req, res) {
	//http://stackoverflow.com/questions/14382725/how-to-get-the-correct-ip-address-of-a-client-into-a-node-socket-io-app-hosted-o
	var client_id = req.header('x-forwarded-for') ? req.header('x-forwarded-for').split(',')[0] : req.connection.remoteAddress;
	console.log( 'server: got a submit from ip_' + client_id );

	req.app.get( 'ip_' + client_id ).emit('message', {
		params: req.params,
		query: req.query
	});
	return res.send( req.query.output || req.query );
};


