import {Container, inject} from 'aurelia-dependency-injection';
import {ArrayCollectionStrategy} from './array-collection-strategy';
import {MapCollectionStrategy} from './map-collection-strategy';
import {NumberStrategy} from './number-strategy';

@inject(Container)
export class CollectionStrategyLocator {
  constructor(container) {
    this.container = container;
    this.strategies = [];
    this.matchers = [];

    this.addStrategy(ArrayCollectionStrategy, items => items instanceof Array);
    this.addStrategy(MapCollectionStrategy, items => items instanceof Map);
    this.addStrategy(NumberStrategy, items => typeof items === 'number');
  }

  addStrategy(collectionStrategy: Function, matcher: (items: any) => boolean) {
    this.strategies.push(collectionStrategy);
    this.matchers.push(matcher);
  }

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
