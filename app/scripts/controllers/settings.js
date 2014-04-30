'use strict';

angular.module('submitRequestApp')
  .controller('SettingsCtrl', function ($scope, $rootScope, $http, User, Auth) {
    $scope.errors = {};

    $scope.changePassword = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Password successfully changed.';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
        });
      }
		};

    $scope.ip_address = '';
		$http.jsonp('http://ipinfo.io/?callback=JSON_CALLBACK').success(function(data) {
			if( $scope.currentUser.ip_addresses.indexOf(data.ip) === -1 )
				$scope.ip_address = data.ip;
		});


    $scope.add_ip = function(ip) {
			if( $scope.currentUser.ip_addresses.indexOf(ip) === -1 )
			{	//console.log( 'User.update({ new_ip: ip })' );
        User.update( { new_ip: ip },
          function(user) {
            //console.log( "RETURNED USER AFER UPDATE" );
            //console.log( user );
            $rootScope.currentUser = user;
          }
        );
			}
    };

    $scope.remove_ip = function(ip) {
      //console.log( 'User.update({ remove_ip: ip })' );
      User.update( { remove_ip: ip },
        function(user) {
          //console.log( "RETURNED USER AFER UPDATE" );
          //console.log( user );
          $rootScope.currentUser = user;
        }
      );
    };

  });
