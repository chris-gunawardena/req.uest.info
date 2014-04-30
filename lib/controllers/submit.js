'use strict';

var mongoose = require('mongoose'); //,Thing = mongoose.model('Thing');

exports.subscribe_to_ips = function(ip_array){

};

exports.get = exports.post = exports.put = exports.del = function(req, res) {
	//http://stackoverflow.com/questions/14382725/how-to-get-the-correct-ip-address-of-a-client-into-a-node-socket-io-app-hosted-o
	var request_ip = req.header('x-forwarded-for') ? req.header('x-forwarded-for').split(',')[0] : req.connection.remoteAddress;
	console.log( ('SERVER: Received a request from ip_' + request_ip).yellow );
	if( req.app.get( 'ip_' + request_ip ) )
	{	req.app.get( 'ip_' + request_ip ).emit('message', {
			ip_address: request_ip,
			method: req.method,
			url: req.originalUrl,
			headers: req.headers,
			body: req.body,
			params: req.params,
			query: req.query
		});
		return res.send( req.query.output || req.query );
	}else
	{	console.log( ('The ip '+request_ip+' is not registered.').red );
		//return res.send( 'The ip '+request_ip+' is not registered. Please login to http://request.info/settings and add it.' );
		res.redirect('/unknown_ip');
	}
};


