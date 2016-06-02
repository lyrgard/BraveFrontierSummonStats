angular.module('bfSS').controller('bfSSResultsController', [
	'$scope', 
	'$routeParams',
    '$http',
	function($scope, $routeParams, $http) {
        var getFullLabel = function(label, value, total) {
            var percentage = Math.floor(((value/total) * 100)+0.5);
            var interval = Math.floor(1960*Math.sqrt((value/total*(1-value/total))/total))/10;
            return label + " : " + percentage + "% (+/- " + interval + "%)";
        };
        
        var getData = function(id) {
            $http.get('data/' + id + '-schema.json').success(function(schema) {
                $http.get('data/' + id + '-data.json').success(function(data) {
                    $scope.title = schema.name;
                    $scope.chartConfigs = [];
                    $scope.chartConfigs[0] = {options: {chart: {type: 'pie'}},series: [{data: []}],title: {text:""},loading: false};
                    var total = 0;
                    for (i = 0; i < schema.groupLabels.length; i++) {
                        var label = schema.groupLabels[i];
                        var groupDef = schema.groups[i];
                        var value = 0;
                        if (groupDef == null) {
                            value = data['unit-' + i + '-0'];
                        } else {
                            var subGroupChartConfig = {options: {chart: {type: 'pie'}},series: [{data: []}],title: {text:label},loading: false};
                            // first calculate total :
                            var subGroupTotal = 0;
                            for (j = 0; j < groupDef.labels.length; j++) {
                                var subGroupValue = data['unit-' + i + '-' + j] || 0;
                                subGroupTotal += subGroupValue;
                            }
                            for (j = 0; j < groupDef.labels.length; j++) {
                                var subGroupValue = data['unit-' + i + '-' + j] || 0;
                                var subGroupLabel = getFullLabel(groupDef.labels[j], subGroupValue, subGroupTotal);
                                subGroupChartConfig.series[0].data[j] = {name: subGroupLabel, y:subGroupValue};
                            }
                            $scope.chartConfigs.push(subGroupChartConfig);
                            value = subGroupTotal;
                        }
                        $scope.chartConfigs[0].series[0].data[i] = {name: label, y:value};
                        total += value;
                    }
                    for (i = 0; i < schema.groupLabels.length; i++) {
                        $scope.chartConfigs[0].series[0].data[i].name = getFullLabel($scope.chartConfigs[0].series[0].data[i].name, $scope.chartConfigs[0].series[0].data[i].y, total);
                    }
                    $scope.chartConfigs[0].series[0].data[0].sliced = true;
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
}]);