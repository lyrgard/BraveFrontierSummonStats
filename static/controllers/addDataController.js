angular.module('bfSS').controller('bfSSAddDataController', [
	'$scope', 
	'$routeParams',
    '$http',
	function($scope, $routeParams, $http) {
	
        $http.get('data/' + $routeParams.id + '-schema.json').success(function(schema) {
		  $scope.schema = schema;
		});
        
        $scope.model = {};
        
        $scope.submit = function() {
            $scope.result = JSON.stringify($scope.model);   
        }
}]);