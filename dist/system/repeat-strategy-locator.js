'use strict';

System.register(['./null-repeat-strategy', './array-repeat-strategy', './map-repeat-strategy', './set-repeat-strategy', './number-repeat-strategy'], function (_export, _context) {
  "use strict";

  var NullRepeatStrategy, ArrayRepeatStrategy, MapRepeatStrategy, SetRepeatStrategy, NumberRepeatStrategy, RepeatStrategyLocator;

  

  return {
    setters: [function (_nullRepeatStrategy) {
      NullRepeatStrategy = _nullRepeatStrategy.NullRepeatStrategy;
    }, function (_arrayRepeatStrategy) {
      ArrayRepeatStrategy = _arrayRepeatStrategy.ArrayRepeatStrategy;
    }, function (_mapRepeatStrategy) {
      MapRepeatStrategy = _mapRepeatStrategy.MapRepeatStrategy;
    }, function (_setRepeatStrategy) {
      SetRepeatStrategy = _setRepeatStrategy.SetRepeatStrategy;
    }, function (_numberRepeatStrategy) {
      NumberRepeatStrategy = _numberRepeatStrategy.NumberRepeatStrategy;
    }],
    execute: function () {
      _export('RepeatStrategyLocator', RepeatStrategyLocator = function () {
        function RepeatStrategyLocator() {
          

          this.matchers = [];
          this.strategies = [];

          this.addStrategy(function (items) {
            return items === null || items === undefined;
          }, new NullRepeatStrategy());
          this.addStrategy(function (items) {
            return items instanceof Array;
          }, new ArrayRepeatStrategy());
          this.addStrategy(function (items) {
            return items instanceof Map;
          }, new MapRepeatStrategy());
          this.addStrategy(function (items) {
            return items instanceof Set;
          }, new SetRepeatStrategy());
          this.addStrategy(function (items) {
            return typeof items === 'number';
          }, new NumberRepeatStrategy());
        }

        RepeatStrategyLocator.prototype.addStrategy = function addStrategy(matcher, strategy) {
          this.matchers.push(matcher);
          this.strategies.push(strategy);
        };

        RepeatStrategyLocator.prototype.getStrategy = function getStrategy(items) {
          var matchers = this.matchers;

          for (var i = 0, ii = matchers.length; i < ii; ++i) {
            if (matchers[i](items)) {
              return this.strategies[i];
            }
          }

          return null;
        };

        return RepeatStrategyLocator;
      }());

      _export('RepeatStrategyLocator', RepeatStrategyLocator);
    }
  };
});