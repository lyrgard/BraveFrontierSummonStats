angular.module('bfSS').controller('bfSSListRuController', [
	'$scope',
    '$location',
    '$http',
	function($scope, $location, $http) {
        $http.get('data/ruList.json').success(function(data) {
            $scope.list = data.list.reverse();
        });
        
        $scope.goToResult = function(id) {
            $location.path('/results/' + id);
        }
}]);