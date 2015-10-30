import {inject, transient} from 'aurelia-dependency-injection';
import {ObserverLocator} from 'aurelia-binding';

@inject(ObserverLocator)
@transient()
export class CollectionStrategy {
  constructor(observerLocator) {
    this.observerLocator = observerLocator;
  }

  initialize(repeat, bindingContext) {
    this.viewFactory = repeat.viewFactory;
    this.viewSlot = repeat.viewSlot;
    this.items = repeat.items;
    this.local = repeat.local;
    this.key = repeat.key;
    this.value = repeat.value;
    this.bindingContext = bindingContext;
  }

  dispose() {
    this.viewFactory = null;
    this.viewSlot = null;
    this.items = null;
    this.local = null;
    this.key = null;
    this.value = null;
    this.bindingContext = null;
  }

  updateBindingContexts(startIndex) {
    let children = this.viewSlot.children;
    let length = children.length;

    if (startIndex > 0) {
      startIndex = startIndex - 1;
    }

    for (; startIndex < length; ++startIndex) {
      this.updateBindingContext(children[startIndex].bindingContext, startIndex, length);
    }
  }

  createFullBindingContext(data, index, length, key) {
    let context = this.createBaseBindingContext(data, key);
    return this.updateBindingContext(context, index, length);
  }

  createBaseBindingContext(data, key) {
    let context = {};
    // is key/value pair (Map)
    if (key) {
      context[this.key] = key;
      context[this.value] = data;
    } else {
      context[this.local] = data;
    }
    context.$parent = this.bindingContext;
    return context;
  }

  createBaseExecutionKvpContext(key, value) {
    let context = {};
    context[this.key] = key;
    context[this.value] = value;
    context.$parent = this.bindingContext;
    return context;
  }

  updateBindingContext(context, index, length) {
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
