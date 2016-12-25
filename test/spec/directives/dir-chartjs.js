'use strict';

describe('Directive: dirChartjs', function () {

  // load the directive's module
  beforeEach(module('dirChartjsApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<dir-chartjs></dir-chartjs>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the dirChartjs directive');
  }));
});
