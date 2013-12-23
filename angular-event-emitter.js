!function(angular, undefined) { 'use strict';
  var ngDecorators = angular.module('ngEventEmitter.decorators', []);
  var ngDirectives = angular.module('ngEventEmitter.directives', []);
  var ngServices = angular.module('ngEventEmitter.services', []);

  ngDecorators.config(['$provide', function($provide) {

    $provide.decorator('$rootScope', ['$delegate', function($delegate) {
      Object.defineProperty($delegate.constructor.prototype, '$onRootScope', {
        value: function(name, listener){
          var unsubscribe = $delegate.$on(name, listener);
          this.$on('$destroy', unsubscribe);
        },
        enumerable: false
      });
      return $delegate;
    }]);

  }]);



  ngDirectives.directive('ngOn', ['$parse', '$rootScope', function($parse, $rootScope) {
    function linker(scope, element, attrs, ngModel) {
      var removeListener = $rootScope.$on('event:'+attrs.ngOn, function(event, args) {
        var callback = $parse(attrs.ngExecute)(scope);
        callback.apply(scope, arguments);
      });
      scope.$on('$destory', removeListener);
    }
    return {
      link: linker
    };
  }]);

  ngServices.factory('$emit', ['$rootScope', function($rootScope) {
    return function(args) {
      $rootScope.$emit.apply($rootScope, arguments);
    }
  }]);

module.directive('ngOn', function() {
  return {
    link: function(scope, element, attrs, ngModel) {
        var toggle = true;
        scope.$onRootScope('event:'+attrs.ngOn, function(event, callback) {
          scope[attrs.ngExecute].apply(this, arguments);
        });
    }
  };
});

module.factory('$emit', ['$rootScope', function($rootScope) {
  return function() {
    $rootScope.$emit.apply($rootScope, arguments);
  }
}]);

  angular.module('ngEventEmitter', [
    'ngEventEmitter.decorators',
    'ngEventEmitter.directives',
    'ngEventEmitter.services'
  ]);

  angular.module('angular-event-emitter', ['ngEventEmitter']);

}(window.angular);
