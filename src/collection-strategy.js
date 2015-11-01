import {inject, transient} from 'aurelia-dependency-injection';
import {ObserverLocator, createOverrideContext} from 'aurelia-binding';

@inject(ObserverLocator)
@transient()
export class CollectionStrategy {
  constructor(observerLocator) {
    this.observerLocator = observerLocator;
  }

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

  createFullOverrideContext(data, index, length, key) {
    let context = this.createBaseOverrideContext(data, key);
    return this.updateOverrideContext(context, index, length);
  }

  createBaseOverrideContext(data, key) {
    let context = createOverrideContext(null, this.overrideContext);
    // is key/value pair (Map)
    if (key) {
      context[this.key] = key;
      context[this.value] = data;
    } else {
      context[this.local] = data;
    }

    return context;
  }

  createBaseOverrideKvpContext(key, value) {
    let context = createOverrideContext(null, this.overrideContext);
    context[this.key] = key;
    context[this.value] = value;
    return context;
  }

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
