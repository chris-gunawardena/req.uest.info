'use strict';

angular.module('submitRequestApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
