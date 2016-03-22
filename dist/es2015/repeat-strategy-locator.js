import { NullRepeatStrategy } from './null-repeat-strategy';
import { ArrayRepeatStrategy } from './array-repeat-strategy';
import { MapRepeatStrategy } from './map-repeat-strategy';
import { SetRepeatStrategy } from './set-repeat-strategy';
import { NumberRepeatStrategy } from './number-repeat-strategy';

export let RepeatStrategyLocator = class RepeatStrategyLocator {
  constructor() {
    this.matchers = [];
    this.strategies = [];

    this.addStrategy(items => items === null || items === undefined, new NullRepeatStrategy());
    this.addStrategy(items => items instanceof Array, new ArrayRepeatStrategy());
    this.addStrategy(items => items instanceof Map, new MapRepeatStrategy());
    this.addStrategy(items => items instanceof Set, new SetRepeatStrategy());
    this.addStrategy(items => typeof items === 'number', new NumberRepeatStrategy());
  }

  addStrategy(matcher, strategy) {
    this.matchers.push(matcher);
    this.strategies.push(strategy);
  }

  getStrategy(items) {
    let matchers = this.matchers;

    for (let i = 0, ii = matchers.length; i < ii; ++i) {
      if (matchers[i](items)) {
        return this.strategies[i];
      }
    }

    return null;
  }
};