import {Container, inject} from 'aurelia-dependency-injection';
import {ArrayCollectionStrategy} from './array-collection-strategy';
import {MapCollectionStrategy} from './map-collection-strategy';
import {NumberStrategy} from './number-strategy';

/**
* Locates the best strategy to best iteraing different types of collections. Custom strategies can be plugged in as well.
*/
@inject(Container)
export class CollectionStrategyLocator {
  /**
  * Creates a new CollectionStrategyLocator.
  * @param container The dependency injection container.
  */
  constructor(container) {
    this.container = container;
    this.strategies = [];
    this.matchers = [];

    this.addStrategy(ArrayCollectionStrategy, items => items instanceof Array);
    this.addStrategy(MapCollectionStrategy, items => items instanceof Map);
    this.addStrategy(NumberStrategy, items => typeof items === 'number');
  }

  /**
  * Adds a collection strategy to be located when iterating different collection types.
  * @param collectionStrategy A collection strategy that can iterate a specific collection type.
  */
  addStrategy(collectionStrategy: Function, matcher: (items: any) => boolean) {
    this.strategies.push(collectionStrategy);
    this.matchers.push(matcher);
  }

  /**
  * Gets the best strategy to handle iteration.
  */
  getStrategy(items: any): CollectionStrategy {
    let matchers = this.matchers;

    for (let i = 0, ii = matchers.length; i < ii; ++i) {
      if (matchers[i](items)) {
        return this.container.get(this.strategies[i]);
      }
    }

    throw new Error('Object in "repeat" must have a valid collection strategy.');
  }
}
