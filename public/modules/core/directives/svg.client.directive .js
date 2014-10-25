'use strict';

angular.forEach(['x', 'y', 'width', 'height'], function(name) {
  var ngName = 'ng' + name[0].toUpperCase() + name.slice(1);
  angular.module('core').directive(ngName, function() {
    return function(scope, element, attrs) {
      attrs.$observe(ngName, function(value) {
        attrs.$set(name, value);
      });
    };
  });
});

angular.module('core').directive('ngXlinkHref', function() {
  return function(scope, element, attrs) {
    attrs.$observe('ngXlinkHref', function(value) {
      attrs.$set('xlink:href', value);
    });
  };
});