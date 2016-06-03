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
            var data = encodeURIComponent(JSON.stringify($scope.model));
            var text = '';
            for (i = 0; i < $scope.schema.groups.length; i++) {
                var group = $scope.schema.groups[i];
                if (group == null) {
                    text += '[b]' + ($scope.model['unit-' + i + '-0'] || 0) + ' ' + $scope.schema.groupLabels[i] + '[/b]\n';
                } else {
                    text += '[b]' + $scope.schema.groupLabels[i] + '[/b]\n[LIST]\n';
                    for (j = 0; j < group.labels.length; j++) {
                        text += '[*]' + ($scope.model['unit-' + i + '-' + j] || 0) + ' ' + group.labels[j] + '\n';
                    }
                    text += '[/LIST]\n';
                }
            }
            text = text.replace(/<img.*<\/img>/g, '');
            window.prompt("Copy this text to the forum", text);
        }
}]);