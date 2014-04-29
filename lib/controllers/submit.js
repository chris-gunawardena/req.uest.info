'use strict';

var mongoose = require('mongoose'); //,Thing = mongoose.model('Thing');

exports.get = exports.post = exports.put = exports.del = function(req, res) {
	//http://stackoverflow.com/questions/14382725/how-to-get-the-correct-ip-address-of-a-client-into-a-node-socket-io-app-hosted-o
	var client_ip = req.header('x-forwarded-for') ? req.header('x-forwarded-for').split(',')[0] : req.connection.remoteAddress;
	console.log( 'SERVER: Received a request from ip_' + client_ip );
	//console.log(req);

	//if logged in, get all ips for that user

	req.app.get( 'ip_' + client_ip ).emit('message', {
		ip_address: client_ip,
		method: req.method,
		url: req.originalUrl,
		headers: req.headers,
		body: req.body,
		params: req.params,
		query: req.query
	});
	return res.send( req.query.output || req.query );
};


