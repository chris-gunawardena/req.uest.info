'use strict';

angular.module( 'submitRequestApp' )
  .controller('UnknownIpCtrl', function ($scope, $http) {

    $scope.unknown_ip = 'xxx';
	$http.jsonp('http://ipinfo.io/?callback=JSON_CALLBACK').success(function(data) {
		$scope.unknown_ip = data.ip;
	});

  });

