;(function(module, angular, undefined) {
'use strict';

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

module.factory('$on', ['$rootScope', function($rootScope) {
  return function() {
    $rootScope.$on.apply($rootScope, arguments);
  }
}]);


}(angular.module('angular-event-emitter', []), angular))
