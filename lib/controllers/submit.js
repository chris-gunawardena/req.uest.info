'use strict';

var mongoose = require('mongoose'); //,Thing = mongoose.model('Thing');

exports.subscribe_to_ips = function(ip_array){

};

exports.get = exports.post = exports.put = exports.del = function(req, res) {

	var request_ip = req.header('x-forwarded-for') ? req.header('x-forwarded-for').split(',')[0] : req.connection.remoteAddress;

	

	//if a client socket exits for this ip
	if( req.app.get( 'ip_' + request_ip ) )
	{	
		//Send the request to sockets linked to this ip
		console.log( ('SERVER: Client ' + request_ip + ' received a request from ip_' + request_ip).yellow );
		req.app.get( 'ip_' + request_ip ).emit('message', {
			ip_address: request_ip,
			method: req.method,
			url: req.originalUrl,
			headers: req.headers,
			body: req.body,
			params: req.params,
			query: req.query
		});

		//Save the app to user
		if( req.app.get('user_'+request_ip) )
		{	console.log( ('SERVER: Request from ip_' + request_ip + ' was saved to user ' + req.app.get('user_'+request_ip).userInfo.name ).yellow );
			req.app.get( 'user_' + request_ip ).requests.unshift( {
				ip_address: request_ip,
				method: req.method,
				url: req.originalUrl,
				headers: req.headers,
				body: req.body,
				params: req.params,
				query: req.query
			} );
			req.app.get( 'user_' + request_ip ).save();
		}else{
			console.log( ('SERVER: No user linked to ip_' + request_ip).red );
		}

		return res.send( req.query.output || req.query );
	}else
	{	console.log( ('The ip '+request_ip+' is not registered.').red );
		//req.app.get('io').sockets.emit('message', "this is a test");
		//return res.send( 'The ip '+request_ip+' is not registered. Please login to http://request.info/settings and add it.' );
		res.redirect('/unknown_ip');
	}
};


