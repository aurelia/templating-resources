import {transient} from 'aurelia-dependency-injection';
import {createOverrideContext} from 'aurelia-binding';

/**
* Base class that defines common properties and methods for a collection strategy implementation.
*/
@transient()
export class CollectionStrategy {
  /**
  * Initializes the strategy collection.
  * @param repeat The repeat instance.
  * @param bindingContext The binding context.
  * @param overrideContext The override context.
  */
  initialize(repeat, bindingContext, overrideContext) {
    this.viewFactory = repeat.viewFactory;
    this.viewSlot = repeat.viewSlot;
    this.items = repeat.items;
    this.local = repeat.local;
    this.key = repeat.key;
    this.value = repeat.value;
    this.bindingContext = bindingContext;
    this.overrideContext = overrideContext;
  }

  /**
  * Disposes the collection strategy.
  */
  dispose() {
    this.viewFactory = null;
    this.viewSlot = null;
    this.items = null;
    this.local = null;
    this.key = null;
    this.value = null;
    this.bindingContext = null;
    this.overrideContext = null;
  }

  /**
  * Update the override context.
  * @param startIndex index in collection where to start updating.
  */
  updateOverrideContexts(startIndex) {
    let children = this.viewSlot.children;
    let length = children.length;

    if (startIndex > 0) {
      startIndex = startIndex - 1;
    }

    for (; startIndex < length; ++startIndex) {
      this.updateOverrideContext(children[startIndex].overrideContext, startIndex, length);
    }
  }

  /**
    * Creates a complete override context.
    * @param data The item's value.
    * @param index The item's index.
    * @param length The collections total length.
    * @param key The key in a key/value pair.
    */
  createFullOverrideContext(data, index, length, key) {
    let context = this.createBaseOverrideContext(data, key);
    return this.updateOverrideContext(context, index, length);
  }

  /**
  * Creates base of an override context.
  * @param data The item's value.
  * @param key The key in a key/value pair.
  */
  createBaseOverrideContext(data, key) {
    let context = createOverrideContext(undefined, this.overrideContext);
    // is key/value pair (Map)
    if (typeof key !== 'undefined') {
      context[this.key] = key;
      context[this.value] = data;
    } else {
      context[this.local] = data;
    }

    return context;
  }

  /**
  * Updates the override context.
  * @param context The context to be updated.
  * @param index The context's index.
  * @param length The collection's length.
  */
  updateOverrideContext(context, index, length) {
    let first = (index === 0);
    let last = (index === length - 1);
    let even = index % 2 === 0;

    context.$index = index;
    context.$first = first;
    context.$last = last;
    context.$middle = !(first || last);
    context.$odd = !even;
    context.$even = even;

    return context;
  }
}
