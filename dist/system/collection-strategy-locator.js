System.register(['aurelia-dependency-injection', './array-collection-strategy', './map-collection-strategy', './number-strategy'], function (_export) {
  'use strict';

  var Container, inject, ArrayCollectionStrategy, MapCollectionStrategy, NumberStrategy, CollectionStrategyLocator;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaDependencyInjection) {
      Container = _aureliaDependencyInjection.Container;
      inject = _aureliaDependencyInjection.inject;
    }, function (_arrayCollectionStrategy) {
      ArrayCollectionStrategy = _arrayCollectionStrategy.ArrayCollectionStrategy;
    }, function (_mapCollectionStrategy) {
      MapCollectionStrategy = _mapCollectionStrategy.MapCollectionStrategy;
    }, function (_numberStrategy) {
      NumberStrategy = _numberStrategy.NumberStrategy;
    }],
    execute: function () {
      CollectionStrategyLocator = (function () {
        function CollectionStrategyLocator(container) {
          _classCallCheck(this, _CollectionStrategyLocator);

          this.container = container;
          this.strategies = [];
          this.matchers = [];

          this.addStrategy(ArrayCollectionStrategy, function (items) {
            return items instanceof Array;
          });
          this.addStrategy(MapCollectionStrategy, function (items) {
            return items instanceof Map;
          });
          this.addStrategy(NumberStrategy, function (items) {
            return typeof items === 'number';
          });
        }

        CollectionStrategyLocator.prototype.addStrategy = function addStrategy(collectionStrategy, matcher) {
          this.strategies.push(collectionStrategy);
          this.matchers.push(matcher);
        };

        CollectionStrategyLocator.prototype.getStrategy = function getStrategy(items) {
          var matchers = this.matchers;

          for (var i = 0, ii = matchers.length; i < ii; ++i) {
            if (matchers[i](items)) {
              return this.container.get(this.strategies[i]);
            }
          }

          throw new Error('Object in "repeat" must have a valid collection strategy.');
        };

        var _CollectionStrategyLocator = CollectionStrategyLocator;
        CollectionStrategyLocator = inject(Container)(CollectionStrategyLocator) || CollectionStrategyLocator;
        return CollectionStrategyLocator;
      })();

      _export('CollectionStrategyLocator', CollectionStrategyLocator);
    }
  };
});