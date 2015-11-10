define(['exports', 'aurelia-dependency-injection', './array-collection-strategy', './map-collection-strategy', './number-strategy'], function (exports, _aureliaDependencyInjection, _arrayCollectionStrategy, _mapCollectionStrategy, _numberStrategy) {
  'use strict';

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var CollectionStrategyLocator = (function () {
    function CollectionStrategyLocator(container) {
      _classCallCheck(this, _CollectionStrategyLocator);

      this.container = container;
      this.strategies = [];
      this.matchers = [];

      this.addStrategy(_arrayCollectionStrategy.ArrayCollectionStrategy, function (items) {
        return items instanceof Array;
      });
      this.addStrategy(_mapCollectionStrategy.MapCollectionStrategy, function (items) {
        return items instanceof Map;
      });
      this.addStrategy(_numberStrategy.NumberStrategy, function (items) {
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
    CollectionStrategyLocator = _aureliaDependencyInjection.inject(_aureliaDependencyInjection.Container)(CollectionStrategyLocator) || CollectionStrategyLocator;
    return CollectionStrategyLocator;
  })();

  exports.CollectionStrategyLocator = CollectionStrategyLocator;
});