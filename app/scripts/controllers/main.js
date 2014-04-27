'use strict';

angular.module('submitRequestApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
	socket.on('message', function (data) {
		console.log(data);
	});
  });
