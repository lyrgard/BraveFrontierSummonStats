angular.module('bfSS', [
	'ngRoute', 
	'ngResource', 
    'ngSanitize',
	'ui.bootstrap',
    'highcharts-ng'
])

.config(['$routeProvider',
     function($routeProvider) { 
         
         // Système de routage
         $routeProvider
         .when('/results/:id', {
             templateUrl: 'partials/results.html',
             controller: 'bfSSResultsController'
         })
         .when('/addData/:id', {
             templateUrl: 'partials/addData.html',
             controller: 'bfSSAddDataController'
         })
         .otherwise({
             redirectTo: '/results/last'
         });
	}
 ])