'use strict';

angular.module( 'submitRequestApp' , ['ngGrid'] )
  .controller('MainCtrl', function ($scope, $http, socket) {
	socket.on('message', function (data) {
		console.log(data);
	});
  });
