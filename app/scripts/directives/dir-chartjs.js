'use strict';

/**
 * @ngdoc directive
 * @name dirChartjs
 * @description
 * # dirChartjs
 */
angular.module('dirChartjsApp')
    .directive('dirChartjs', [function () {
        return {
            template: '<div class="dir-chartjs">' +
                '<lable for="cumulative-option" ng-show="isRendered">' +
                    '<input id="cumulative-option" type="checkbox" ng-model="isCumulative" /> Cumulative' +
                '</lable>' +
                '<canvas class="dir-chartjs__canvas"></canvas>' +
            '</div>',
            replace: true,
            restrict: 'EA',
            scope: {
                data: '=',
                tooltip: '=?',
                chartType: '=?',
                options: '=?',
                canvasWidth: '=?',
                canvasHeight: '=?'
            },
            link: function postLink(scope, element, attrs) {
                // get canvas element
                var canvasElem = angular.element(document.getElementsByTagName('canvas'));
                // get canvas context
                var ctx = canvasElem[0].getContext('2d');
                // default chart options
                var options = {
                    scales: {
                        xAxes: [{
                            display: false,
                            gridLines: {
                                color: "rgba(0, 0, 0, 0)"
                            }
                        }],
                        yAxes: [{
                            display: false,
                            gridLines: {
                                color: "rgba(0, 0, 0, 0)"
                            },
                            stacked: true
                        }]
                    }
                };

                // set defaults point configuration.
                Chart.defaults.global.elements.point = {
                    radius: 3,
                    hitRadius: 3,
                    hoverRadius: 4
                };

                // set defaults label configuration.
                Chart.defaults.global.legend = {
                    position: 'top',
                    labels : {
                        fontSize: 12,
                        fontStyle: "normal",
                        fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
                    }
                };

                // set default value
                scope.data = scope.data || [];
                scope.options = (scope.options && angular.merge(scope.options, options)) || options;
                scope.isCumulative = false;
                scope.isRendered = false;
                scope.chartInstance = null;
                scope.chartType = scope.chartType || 'line';
                scope.canvasWidth = scope.canvasWidth || "100%";
                scope.canvasHeight = scope.canvasHeight || 100;

                // set canvas width
                canvasElem[0].width = scope.canvasWidth;
                // set canvas height
                canvasElem[0].height = scope.canvasHeight;

                // Observe data
                scope.$watch('data', function observeData(newVal, oldVal) {
                    if(newVal && !angular.isArray(newVal)) { // for object
                        transformDataForObject(newVal);
                    }
                });

                // Observe cumulative option
                scope.$watch('isCumulative', function checkCumulative(newVal, oldVal) {
                    if(scope.chartInstance) {
                        scope.chartInstance.options.scales.yAxes[0].stacked = newVal;
                        scope.chartInstance.update();
                    }
                });

                // Destroy chart instance
                scope.$on('$destroy', function destroy() {
                    scope.chartInstance.destroy();
                });

                // Observe on window resize.
                $(window).on('resize', function resizeWindow() {
                    if(scope.chartInstance) {
                        scope.chartInstance.resize();
                    }
                });

                // transform data for object
                function transformDataForObject(dataObj) {
                    var data = {
                        // label on axis
                        labels: [],
                        // Example.
                        // datasets: [{
                        //     // label show when hover
                        //     label: 'apples',
                        //     // data
                        //     data: [12, 19, 3, 17, 6, 3, 7],
                        //     borderColor: "rgba(75,192,192,1)",
                        //     backgroundColor: "rgba(153,255,51,0.6)"
                        // }, {
                        //     // label show when hover
                        //     label: 'oranges',
                        //     data: [2, 29, 5, 5, 2, 3, 10],
                        //     backgroundColor: "rgba(255,153,0,0.6)"
                        // }],
                        datasets: []
                    };
                    angular.forEach(dataObj, function transformObject(val, key) {
                        // data.labels.push(); // #TODO Tooltip data
                        data.datasets.push({
                            label: key,
                            data: val.data,
                            borderColor: val.color, // #TODO darken color
                            backgroundColor: val.color // #TODO lighten color
                        });
                    });
                    renderChart(data);
                }

                // render chart
                function renderChart(data) {
                    // create chart
                    scope.chartInstance = new Chart(ctx, {
                        type: scope.chartType,
                        data: data,
                        options: scope.options
                    });
                    scope.isRendered = true;
                }
            }
        };
    }]);
