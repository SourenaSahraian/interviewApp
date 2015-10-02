'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
angular
  .module('AngularApp', [
    'ngRoute', 'xeditable'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/home', {
        template: '<div>test</div>'
      })
      .when('/issues', {
        templateUrl: '../views/issues.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
