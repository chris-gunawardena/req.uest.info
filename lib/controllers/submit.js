'use strict';

var mongoose = require('mongoose'); //,Thing = mongoose.model('Thing');

exports.subscribe_to_ips = function(ip_array){

};

exports.get = exports.post = exports.put = exports.del = function(req, res) {

	var request_ip = req.header('x-forwarded-for') ? req.header('x-forwarded-for').split(',')[0] : req.connection.remoteAddress;
	var date_time = new Date();

	req.app.get('io').sockets.emit('message', {
		ip_address: request_ip,
		method: req.method,
		url: req.originalUrl,
		headers: req.headers,
		body: req.body,
		params: req.params,
		query: req.query,
		time: date_time.getDate() + "/" + (date_time.getMonth()+1)  + "/" + date_time.getFullYear() + ' ' + date_time.getHours() + ":" + date_time.getMinutes() + ":" + date_time.getSeconds()
	});			

	return res.send(200);

};