angular.module('bfSS').controller('bfSSResultsController', [
	'$scope', 
	'$routeParams',
    '$http',
	function($scope, $routeParams, $http) {
        var getData = function(id) {
            $http.get('data/' + id + '-schema.json').success(function(schema) {
                $http.get('data/' + id + '-data.json').success(function(data) {
                    $scope.results = {id:id, name:schema.name, labels:[], data:[], subResults: []};
                    for (i = 0; i < schema.groupLabels.length; i++) {
                        $scope.results.labels[i] = schema.groupLabels[i];
                        var groupDef = schema.groups[i];
                        if (groupDef == null) {
                            $scope.results.data[i] = data['unit-' + i + '-0'];
                            $scope.results.subResults[i] = null;
                        } else {
                            var total = 0;
                            var subResult = {labels:groupDef.labels, data:[]};
                            for (j = 0; j < groupDef.labels.length; j++) {
                                var number = data['unit-' + i + '-' + j] || 0;
                                total += number;
                                subResult.data[j] = number;
                            }
                            $scope.results.data[i] = total;
                            $scope.results.subResults[i] = subResult;
                        }
                    }
                });
            });
        };
        
        
        if ($routeParams.id == 'last') {
            $http.get('data/ruList.json').success(function(data) {
                var lastRu = data.list[data.list.length - 1];
                getData(lastRu.id);
            });
        } else {
            getData($routeParams.id);
        }
        
        $scope.options = {
            showAllTooltips: true,
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        //get the concerned dataset
                        var dataset = data.datasets[tooltipItem.datasetIndex];
                        //calculate the total of this data set
                        var total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {
                            return previousValue + currentValue;
                        });
                        //get the current items value
                        var currentValue = dataset.data[tooltipItem.index];
                        var currentLabel = data.labels[tooltipItem.index];
                        //calculate the precentage based on the total and current item, also this does a rough rounding to give a whole number
                        var percentage = Math.floor(((currentValue/total) * 100)+0.5);
                        var interval = Math.floor(1960*Math.sqrt((currentValue/total*(1-currentValue/total))/total))/10;
                        return currentLabel + " : " + percentage + "% (+/- " + interval + "%)";
                    }
                }
            } 
        };
}]);