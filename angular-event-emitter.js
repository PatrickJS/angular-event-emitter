!function(angular, undefined) { 'use strict';
  var ngDecorators = angular.module('ngEventEmitter.decorators', []);
  var ngDirectives = angular.module('ngEventEmitter.directives', []);
  var ngServices = angular.module('ngEventEmitter.services', []);

  ngDecorators.config(['$provide', function($provide) {
    function onRootScope(name, listener){
      var unsubscribe = $delegate.$on(name, listener);
      this.$on('$destroy', unsubscribe);
    }

    $provide.decorator('$rootScope', ['$delegate', function($delegate) {
      Object.defineProperty($delegate.constructor.prototype, '$onRootScope', {
        value: onRootScope,
        enumerable: false
      });
      return $delegate;
    }]);

  }]);


  ngDirectives.directive('ngChannel', ['$rootScope', function($rootScope) {
    function linker(scope, element, attrs, ngModel) {
      /* work in progress $eval method
      var _event = scope.$eval(attrs.ngChannel);
      console.log(_event)
      */
      var _event = attrs.ngChannel.split(':')[0];
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
      return $rootScope.$on.apply($rootScope, arguments);
    }
  }]);

  ngServices.factory('$once', ['$rootScope', function($rootScope) {
    return function(event, callback) {
      var removeListener1 = angular.noop;
      var removeListener2 = angular.noop;
      function once() {
        removeListener1();
        removeListener2();
      }
      removeListener1 = $rootScope.$on(event, callback);
      removeListener2 = $rootScope.$on(event, once);
    }
  }]);

  angular.module('ngEventEmitter', [
    'ngEventEmitter.decorators',
    'ngEventEmitter.directives',
    'ngEventEmitter.services'
  ]);

  angular.module('angular-event-emitter', ['ngEventEmitter']);

}(window.angular);
