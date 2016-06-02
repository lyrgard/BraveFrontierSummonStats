angular.module('bfSS').controller('bfSSResultsController', [
	'$scope', 
	'$routeParams',
    '$http',
	function($scope, $routeParams, $http) {
        var getFullLabel = function(label, value, total) {
            var percentage = Math.floor(((value/total) * 100)+0.5);
            var interval = Math.floor(1960*Math.sqrt((value/total*(1-value/total))/total))/10;
            return label + " : " + percentage + "% (+/- " + interval + '%)';
        };
        
        var getNewChartConfig = function(label) {
            return {
                options: {
                    chart: {type: 'pie'},
                    plotOptions: {
                        pie: {
                            dataLabels: {
                                useHTML: true,
                                distance: 40,
                                y: -10
                            }
                        }
                    }
                },
                /*plotOptions: {
                    series : {
                        dataLabels: {
                            enabled: true,
                            format: 'to {y} <img src="http://vignette3.wikia.nocookie.net/bravefrontierrpg/images/6/65/Unit_ills_thum_50166.png/revision/latest/scale-to-width-down/42?cb=20160106141141&path-prefix=fr"></img>',
                            useHTML: true
                        }
                    }
                },*/
                series: [
                    {data: []}
                ],
                title: {text:label},
                loading: false
            };
        }
        
        var getData = function(id) {
            $http.get('data/' + id + '-schema.json').success(function(schema) {
                $http.get('data/' + id + '-data.json').success(function(data) {
                    $scope.title = schema.name;
                    $scope.chartConfigs = [];
                    $scope.chartConfigs[0] = getNewChartConfig("");
                    var total = 0;
                    for (i = 0; i < schema.groupLabels.length; i++) {
                        var label = schema.groupLabels[i];
                        var groupDef = schema.groups[i];
                        var value = 0;
                        if (groupDef == null) {
                            value = data['unit-' + i + '-0'];
                        } else {
                            var subGroupChartConfig = getNewChartConfig(label);
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