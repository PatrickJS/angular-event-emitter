!function(angular, undefined) { 'use strict';
  var ngDecorators = angular.module('ngEventEmitter.decorators', []);
  var ngDirectives = angular.module('ngEventEmitter.directives', []);
  var ngServices = angular.module('ngEventEmitter.services', []);

angular.module('ngEventEmitter', ['angular-event-emitter']);

module.config(['$provide', function($provide) {

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

module.directive('ngChannel', ['$rootScope', function($rootScope) {
  return {
    scope: {
        ngEmit: '='
    },
    link: function(scope, element, attrs, ngModel) {
      var _event = attrs.ngChannel.split(':')[0]
      element.bind(_event, function() {
        $rootScope.$emit('event:'+attrs.ngChannel, scope.ngEmit || attrs.ngEmit);
      });

    }
  };
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
