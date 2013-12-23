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


  ngDirectives.directive('ngChannel', ['$rootScope', function($rootScope) {
    function linker(scope, element, attrs, ngModel) {
      var _event = attrs.ngChannel.split(':')[0];
      // var _event = scope.$eval(attrs.ngChannel);
      // console.log(_event)
      element.bind(_event, function(event) {
        var arg = (scope.ngEmit !== undefined) ? scope.ngEmit : attrs.ngEmit;
        $rootScope.$emit.call($rootScope, 'event:'+attrs.ngChannel, arg);
      });
    }
    return {
      scope: {
          ngEmit: '='
      },
      link: linker
    };
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

  ngServices.factory('$on', ['$rootScope', function($rootScope) {
    return function(args) {
      $rootScope.$on.apply($rootScope, arguments);
    }
  }]);

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
