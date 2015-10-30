import {Container, inject} from 'aurelia-dependency-injection';
import {ArrayCollectionStrategy} from './array-collection-strategy';
import {MapCollectionStrategy} from './map-collection-strategy';
import {NumberStrategy} from './number-strategy';

@inject(Container)
export class CollectionStrategyLocator {
  constructor(container) {
    this.container = container;
  }

  getStrategy(items) {
    let strategy;
    if (items instanceof Array) {
      strategy = this.container.get(ArrayCollectionStrategy);
    } else if (items instanceof Map) {
      strategy = this.container.get(MapCollectionStrategy);
    } else if ((typeof items === 'number')) {
      strategy = this.container.get(NumberStrategy);
    } else {
      throw new Error('Object in "repeat" must be of type Array, Map or Number');
    }

    return strategy;
  }
}
