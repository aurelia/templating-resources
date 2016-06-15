

import { NullRepeatStrategy } from './null-repeat-strategy';
import { ArrayRepeatStrategy } from './array-repeat-strategy';
import { MapRepeatStrategy } from './map-repeat-strategy';
import { SetRepeatStrategy } from './set-repeat-strategy';
import { NumberRepeatStrategy } from './number-repeat-strategy';

export var RepeatStrategyLocator = function () {
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
}();