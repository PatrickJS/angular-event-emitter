angular-event-emitter
=====================

Event emitters for AngularJS 


#How do I add this to my project?

You can download angular-event-emitter by:

* (prefered) Using bower and running `bower install angular-event-emitter --save`
* Using npm and running `npm install angular-event-emitter --save`
* Downloading it manually by clicking [here to download development unminified version](https://raw.github.com/gdi2290/angular-event-emitter/master/angular-event-emitter.js)


````html
<html>
<body ng-app="YOUR_APP">
  <div ng-controller="MainController">
    <span ng-repeat="toggle in toggles">
        <input type="button" ng-channel="click:{{ 'channel'+$index }}" ng-emit="$index" value="Toggle {{ toggle }}" />
    </span>
    <button ng-click="add(toggles)">Add more</button>

    <span ng-repeat="toggle in toggles"
          ng-on="click:{{ 'channel'+$index }}"
          ng-execute="callback"
          toggle-section>
        <p>This is section #{{ toggle }}</p>
    </span>
  </div>


  <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.2.6/angular.js"></script>
  <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.2.6/angular-animate.js"></script>
  <script src="bower_components/angular-event-emitter/angular-event-emitter.js"></script>
  <script type="text/javascript">
    angular.module('YOUR_APP', [
      'ngEventEmitter' // you may also use 'angular-event-emitter'
    ])
    .controller('MainController', function($scope, $once, $on, $emit) {
        $once('event', function(event, args) {
          console.log('$once ', args);
        });
        $on('event', function(event, args) {
          console.log('$on', args);
        });

        $scope.add = function(collection) {
          var lastIndex = collection.length-1;
          var count = collection[lastIndex];
          collection.push(count+1);
        };

        $scope.toggle = true;
        $scope.toggles = [1,2,3]; // should be names
    //    $scope.triggerArgs = function() {};
        $scope.callback = function(value) {
          $emit('event', 'trigger event');
          console.log('callback ', arguments);
        };
    })
    .directive('toggleSection', function($animate) {
      return function(scope, element, attrs) {
        var toggle = true;
        scope.$onRootScope('event:'+(attrs.ngOn || attrs.toggleSection), function(ev,num) {
          toggle = !toggle;
          var toggleClass = (toggle) ? 'removeClass' : 'addClass';
          $animate[toggleClass](element, 'ng-hide');
          $animate[toggleClass](element, 'ng-show');
        });
      }
    });


  </script>
</body>
</html>
````
