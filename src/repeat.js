/*eslint no-loop-func:0, no-unused-vars:0*/
import {inject} from 'aurelia-dependency-injection';
import {ObserverLocator, calcSplices, getChangeRecords} from 'aurelia-binding';
import {BoundViewFactory, ViewSlot, customAttribute, bindable, templateController} from 'aurelia-templating';

/**
* Binding to iterate over an array and repeat a template
*
* @class Repeat
* @constructor
* @param {BoundViewFactory} viewFactory The factory generating the view
* @param {ViewSlot} viewSlot The slot the view is injected in to
* @param {ObserverLocator} observerLocator The observer locator instance
*/
@customAttribute('repeat')
@templateController
@inject(BoundViewFactory, ViewSlot, ObserverLocator)
export class Repeat {
  /**
  * List of items to bind the repeater to
  *
  * @property items
  * @type {Array}
  */
  @bindable items
  @bindable local
  @bindable key
  @bindable value
  constructor(viewFactory, viewSlot, observerLocator) {
    this.viewFactory = viewFactory;
    this.viewSlot = viewSlot;
    this.observerLocator = observerLocator;
    this.local = 'item';
    this.key = 'key';
    this.value = 'value';
  }

  call(context, changes) {
    this[context](this.items, changes);
  }

  bind(bindingContext) {
    let items = this.items;
    let viewSlot = this.viewSlot;
    let observer;

    this.bindingContext = bindingContext;

    if (!items) {
      if (this.oldItems) {
        viewSlot.removeAll(true);
      }

      return;
    }

    if (this.oldItems === items) {
      if (items instanceof Map) {
        let records = getChangeRecords(items);
        this.collectionObserver = this.observerLocator.getMapObserver(items);

        this.handleMapChangeRecords(items, records);

        this.callContext = 'handleMapChangeRecords';
        this.collectionObserver.subscribe(this.callContext, this);
      } else if (items instanceof Array) {
        let splices = calcSplices(items, 0, items.length, this.lastBoundItems, 0, this.lastBoundItems.length);
        this.collectionObserver = this.observerLocator.getArrayObserver(items);

        this.handleSplices(items, splices);
        this.lastBoundItems = this.oldItems = null;

        this.callContext = 'handleSplices';
        this.collectionObserver.subscribe(this.callContext, this);
      }
      return;
    } else if (this.oldItems) {
      viewSlot.removeAll(true);
    }

    this.processItems();
  }

  unbind() {
    this.oldItems = this.items;

    if (this.items instanceof Array) {
      this.lastBoundItems = this.items.slice(0);
    }

    this.unsubscribeCollection();
  }

  unsubscribeCollection() {
    if (this.collectionObserver) {
      this.collectionObserver.unsubscribe(this.callContext, this);
      this.collectionObserver = null;
      this.callContext = null;
    }
  }

  itemsChanged() {
    this.processItems();
  }

  processItems() {
    let items = this.items;
    let rmPromise;

    if (this.collectionObserver) {
      this.unsubscribeCollection();
      rmPromise = this.viewSlot.removeAll(true);
    }

    if (!items && items !== 0) {
      return;
    }

    if (rmPromise instanceof Promise) {
      rmPromise.then(() => {
        this.processItemsByType();
      });
    } else {
      this.processItemsByType();
    }
  }

  processItemsByType() {
    let items = this.items;
    if (items instanceof Array) {
      this.processArrayItems(items);
    } else if (items instanceof Map) {
      this.processMapEntries(items);
    } else if ((typeof items === 'number')) {
      this.processNumber(items);
    } else {
      throw new Error('Object in "repeat" must be of type Array, Map or Number');
    }
  }

  processArrayItems(items) {
    let viewFactory = this.viewFactory;
    let viewSlot = this.viewSlot;
    let i;
    let ii;
    let row;
    let view;
    let observer;

    this.collectionObserver = this.observerLocator.getArrayObserver(items);

    for (i = 0, ii = items.length; i < ii; ++i) {
      row = this.createFullBindingContext(items[i], i, ii);
      view = viewFactory.create(row);
      viewSlot.add(view);
    }

    this.callContext = 'handleSplices';
    this.collectionObserver.subscribe(this.callContext, this);
  }

  processMapEntries(items) {
    let viewFactory = this.viewFactory;
    let viewSlot = this.viewSlot;
    let index = 0;
    let row;
    let view;
    let observer;

    this.collectionObserver = this.observerLocator.getMapObserver(items);

    items.forEach((value, key) => {
      row = this.createFullExecutionKvpContext(key, value, index, items.size);
      view = viewFactory.create(row);
      viewSlot.add(view);
      ++index;
    });

    this.callContext = 'handleMapChangeRecords';
    this.collectionObserver.subscribe(this.callContext, this);
  }

  processNumber(value) {
    let viewFactory = this.viewFactory;
    let viewSlot = this.viewSlot;
    let childrenLength = viewSlot.children.length;
    let i;
    let ii;
    let row;
    let view;
    let viewsToRemove;

    value = Math.floor(value);
    viewsToRemove = childrenLength - value;

    if (viewsToRemove > 0) {
      if (viewsToRemove > childrenLength) {
        viewsToRemove = childrenLength;
      }

      for (i = 0, ii = viewsToRemove; i < ii; ++i) {
        viewSlot.removeAt(childrenLength - (i + 1), true);
      }

      return;
    }

    for (i = childrenLength, ii = value; i < ii; ++i) {
      row = this.createFullBindingContext(i, i, ii);
      view = viewFactory.create(row);
      viewSlot.add(view);
    }
  }

  createBaseBindingContext(data) {
    let context = Object.create(this.bindingContext);
    context[this.local] = data;
    context.$parent = this.bindingContext;
    return context;
  }

  createBaseExecutionKvpContext(key, value) {
    let context = Object.create(this.bindingContext);
    context[this.key] = key;
    context[this.value] = value;
    context.$parent = this.bindingContext;
    return context;
  }

  createFullBindingContext(data, index, length) {
    let context = this.createBaseBindingContext(data);
    return this.updateBindingContext(context, index, length);
  }

  createFullExecutionKvpContext(key, value, index, length) {
    let context = this.createBaseExecutionKvpContext(key, value);
    return this.updateBindingContext(context, index, length);
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

  handleSplices(array, splices) {
    let removeDelta = 0;
    let viewSlot = this.viewSlot;
    let rmPromises = [];

    for (let i = 0, ii = splices.length; i < ii; ++i) {
      let splice = splices[i];
      let removed = splice.removed;

      for (let j = 0, jj = removed.length; j < jj; ++j) {
        let viewOrPromise = viewSlot.removeAt(splice.index + removeDelta + rmPromises.length, true);
        if (viewOrPromise instanceof Promise) {
          rmPromises.push(viewOrPromise);
        }
      }
      removeDelta -= splice.addedCount;
    }

    if (rmPromises.length > 0) {
      Promise.all(rmPromises).then(() => {
        let spliceIndexLow = this.handleAddedSplices(array, splices);
        this.updateBindingContexts(spliceIndexLow);
      });
    } else {
      let spliceIndexLow = this.handleAddedSplices(array, splices);
      this.updateBindingContexts(spliceIndexLow);
    }
  }

  handleAddedSplices(array, splices) {
    let spliceIndex;
    let spliceIndexLow;
    let arrayLength = array.length;
    for (let i = 0, ii = splices.length; i < ii; ++i) {
      let splice = splices[i];
      let addIndex = spliceIndex = splice.index;
      let end = splice.index + splice.addedCount;

      if (typeof spliceIndexLow === 'undefined' || spliceIndexLow === null || spliceIndexLow > splice.index) {
        spliceIndexLow = spliceIndex;
      }

      for (; addIndex < end; ++addIndex) {
        let row = this.createFullBindingContext(array[addIndex], addIndex, arrayLength);
        let view = this.viewFactory.create(row);
        this.viewSlot.insert(addIndex, view);
      }
    }

    return spliceIndexLow;
  }

  handleMapChangeRecords(map, records) {
    let viewSlot = this.viewSlot;
    let key;
    let i;
    let ii;
    let view;
    let children;
    let length;
    let row;
    let removeIndex;
    let record;

    for (i = 0, ii = records.length; i < ii; ++i) {
      record = records[i];
      key = record.key;
      switch (record.type) {
      case 'update':
        removeIndex = this.getViewIndexByKey(key);
        viewSlot.removeAt(removeIndex, true);
        row = this.createBaseExecutionKvpContext(key, map.get(key));
        view = this.viewFactory.create(row);
        viewSlot.insert(removeIndex, view);
        break;
      case 'add':
        row = this.createBaseExecutionKvpContext(key, map.get(key));
        view = this.viewFactory.create(row);
        viewSlot.insert(map.size, view);
        break;
      case 'delete':
        if (!record.oldValue) { return; }
        removeIndex = this.getViewIndexByKey(key);
        viewSlot.removeAt(removeIndex, true);
        break;
      case 'clear':
        viewSlot.removeAll(true);
        break;
      default:
        continue;
      }
    }

    children = viewSlot.children;
    length = children.length;

    for (i = 0; i < length; i++) {
      this.updateBindingContext(children[i].bindingContext, i, length);
    }
  }

  getViewIndexByKey(key) {
    let viewSlot = this.viewSlot;
    let i;
    let ii;
    let child;

    for (i = 0, ii = viewSlot.children.length; i < ii; ++i) { // TODO (martingust) better way to get index?
      child = viewSlot.children[i];
      if (child.bindings[0].source[this.key] === key) {
        return i;
      }
    }
  }
}
