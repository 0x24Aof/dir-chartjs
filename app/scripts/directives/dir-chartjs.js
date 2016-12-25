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
                '<lable for="cumulative-option">' +
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

                // set defaults point
                Chart.defaults.global.elements.point.radius = 3;
                Chart.defaults.global.elements.point.hitRadius = 3;
                Chart.defaults.global.elements.point.hoverRadius = 4;

                // set default value
                scope.options = (scope.options && angular.merge(scope.options, options)) || options;
                scope.isCumulative = false;
                scope.chartType = scope.chartType || 'line';
                scope.canvasWidth = scope.canvasWidth || "100%";
                scope.canvasHeight = scope.canvasHeight || 100;

                // set canvas width
                canvasElem[0].width = scope.canvasWidth;
                // set canvas height
                canvasElem[0].height = scope.canvasHeight;

                scope.data = scope.data || {
                    // label on axis
                    labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
                    datasets: [{
                        // label show when hover
                        label: 'apples',
                        // data
                        data: [12, 19, 3, 17, 6, 3, 7],
                        borderColor: "rgba(75,192,192,1)",
                        backgroundColor: "rgba(153,255,51,0.6)"
                    }, {
                        // label show when hover
                        label: 'oranges',
                        data: [2, 29, 5, 5, 2, 3, 10],
                        backgroundColor: "rgba(255,153,0,0.6)"
                    }]
                };

                // create chart
                var chartInstance = new Chart(ctx, {
                    type: scope.chartType,
                    data: scope.data,
                    options: options
                });

                // Observe data
                scope.$watch('data', function observeData(newVal, oldVal) {
                    if(!angular.isArray(newVal)) { // for object
                        transformDataForObject(newVal);
                    }else { // for array
                        transformDataForArray(newVal);
                    }
                });

                // Observe cumulative option
                scope.$watch('isCumulative', function checkCumulative(newVal, oldVal) {
                    chartInstance.options.scales.yAxes[0].stacked = newVal;
                    chartInstance.update();
                });

                // Destroy chart instance
                scope.$on('$destroy', function destroy() {
                    chartInstance.destroy();
                });

                // Observe on window resize.
                $(window).on('resize', function resizeWindow() {
                    chartInstance.resize();
                });

                // transform data for object
                function transformDataForObject(data) {

                }

                // transform data for array
                function transformDataForArray(data) {
                    if(!!data.length) {

                    }
                }
            }
        };
    }]);
