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
}(angular.module('angular-event-emitter', []), angular))
