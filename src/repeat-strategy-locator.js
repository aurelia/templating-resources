import {NullRepeatStrategy} from './null-repeat-strategy';
import {ArrayRepeatStrategy} from './array-repeat-strategy';
import {MapRepeatStrategy} from './map-repeat-strategy';
import {SetRepeatStrategy} from './set-repeat-strategy';
import {NumberRepeatStrategy} from './number-repeat-strategy';

/**
* A strategy is for repeating a template over an iterable or iterable-like object.
*/
interface RepeatStrategy {
  instanceChanged(repeat: Repeat, items: any): void;
  instanceMutated(repeat: Repeat, items: any, changes: any): void;
  getCollectionObserver(observerLocator: any, items: any): any;
}

/**
* Locates the best strategy to best repeating a template over different types of collections.
* Custom strategies can be plugged in as well.
*/
export class RepeatStrategyLocator {
  /**
  * Creates a new RepeatStrategyLocator.
  */
  constructor() {
    this.matchers = [];
    this.strategies = [];

    this.addStrategy(items => items === null || items === undefined, new NullRepeatStrategy());
    this.addStrategy(items => items instanceof Array, new ArrayRepeatStrategy());
    this.addStrategy(items => items instanceof Map, new MapRepeatStrategy());
    this.addStrategy(items => items instanceof Set, new SetRepeatStrategy());
    this.addStrategy(items => typeof items === 'number', new NumberRepeatStrategy());
  }

  /**
  * Adds a repeat strategy to be located when repeating a template over different collection types.
  * @param strategy A repeat strategy that can iterate a specific collection type.
  */
  addStrategy(matcher: (items: any) => boolean, strategy: RepeatStrategy) {
    this.matchers.push(matcher);
    this.strategies.push(strategy);
  }

  /**
  * Gets the best strategy to handle iteration.
  */
  getStrategy(items: any): RepeatStrategy {
    let matchers = this.matchers;

    for (let i = 0, ii = matchers.length; i < ii; ++i) {
      if (matchers[i](items)) {
        return this.strategies[i];
      }
    }

    return null;
  }
}
