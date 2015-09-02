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

  bind(bindingContext) {
    let items = this.items;
    let observer;

    this.bindingContext = bindingContext;

    if (!items) {
      if (this.oldItems) {
        this.removeAll();
      }

      return;
    }

    if (this.oldItems === items) {
      if (items instanceof Map) {
        let records = getChangeRecords(items);
        observer = this.observerLocator.getMapObserver(items);

        this.handleMapChangeRecords(items, records);

        this.disposeSubscription = observer.subscribe(r => {
          this.handleMapChangeRecords(items, r);
        });
      } else {
        let splices = calcSplices(items, 0, items.length, this.lastBoundItems, 0, this.lastBoundItems.length);
        observer = this.observerLocator.getArrayObserver(items);

        this.handleSplices(items, splices);
        this.lastBoundItems = this.oldItems = null;

        this.disposeSubscription = observer.subscribe(s => {
          this.handleSplices(items, s);
        });

        return;
      }
    } else if (this.oldItems) {
      this.removeAll();
    }

    this.processItems();
  }

  unbind() {
    this.oldItems = this.items;

    if (this.items instanceof Array) {
      this.lastBoundItems = this.items.slice(0);
    }

    if (this.disposeSubscription) {
      this.disposeSubscription();
      this.disposeSubscription = null;
    }
  }

  itemsChanged() {
    this.processItems();
  }

  processItems() {
    let items = this.items;

    if (this.disposeSubscription) {
      this.disposeSubscription();
      this.removeAll();
    }

    if (!items && items !== 0) {
      return;
    }

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

    observer = this.observerLocator.getArrayObserver(items);

    for (i = 0, ii = items.length; i < ii; ++i) {
      row = this.createFullBindingContext(items[i], i, ii);
      view = viewFactory.create(row);
      viewSlot.add(view);
    }

    this.disposeSubscription = observer.subscribe(splices => {
      this.handleSplices(items, splices);
    });
  }

  processMapEntries(items) {
    let viewFactory = this.viewFactory;
    let viewSlot = this.viewSlot;
    let index = 0;
    let row;
    let view;
    let observer;

    observer = this.observerLocator.getMapObserver(items);

    items.forEach((value, key) => {
      row = this.createFullExecutionKvpContext(key, value, index, items.size);
      view = viewFactory.create(row);
      viewSlot.add(view);
      ++index;
    });

    this.disposeSubscription = observer.subscribe(record => {
      this.handleMapChangeRecords(items, record);
    });
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
        viewSlot.removeAt(childrenLength - (i + 1));
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
    let context = {};
    context[this.local] = data;
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

  handleSplices(array, splices) {
    let viewLookup = new Map();
    let viewSlot = this.viewSlot;
    let spliceIndexLow;
    let viewOrPromise;
    let view;
    let i;
    let ii;
    let j;
    let jj;
    let row;
    let splice;
    let addIndex;
    let itemsLeftToAdd;
    let removed;
    let model;
    let context;
    let spliceIndex;
    let viewsToUnbind;
    let end;

    for (i = 0, ii = splices.length; i < ii; ++i) {
      splice = splices[i];
      addIndex = spliceIndex = splice.index;
      itemsLeftToAdd = splice.addedCount;
      end = splice.index + splice.addedCount;
      removed = splice.removed;
      if (typeof spliceIndexLow === 'undefined' || spliceIndexLow === null || spliceIndexLow > splice.index) {
        spliceIndexLow = spliceIndex;
      }

      for (j = 0, jj = removed.length; j < jj; ++j) {
        if (itemsLeftToAdd > 0) {
          view = viewSlot.children[spliceIndex + j];
          view.detached();
          context = this.createFullBindingContext(array[addIndex + j], spliceIndex + j, array.length);
          view.bind(context);
          view.attached();
          --itemsLeftToAdd;
        } else {
          viewOrPromise = viewSlot.removeAt(addIndex + splice.addedCount);
          if (viewOrPromise) {
            viewLookup.set(removed[j], viewOrPromise);
          }
        }
      }

      addIndex += removed.length;

      for (; itemsLeftToAdd > 0; ++addIndex) {
        model = array[addIndex];
        viewOrPromise = viewLookup.get(model);
        if (viewOrPromise instanceof Promise) {
          ((localAddIndex, localModel) => {
            viewOrPromise.then(v => {
              viewLookup.delete(localModel);
              viewSlot.insert(localAddIndex, v);
            });
          })(addIndex, model);
        } else if (viewOrPromise) {
          viewLookup.delete(model);
          viewSlot.insert(addIndex, viewOrPromise);
        } else {
          row = this.createBaseBindingContext(model);
          view = this.viewFactory.create(row);
          viewSlot.insert(addIndex, view);
        }
        --itemsLeftToAdd;
      }
    }

    viewsToUnbind = viewLookup.size;

    if (viewsToUnbind === 0) {
      this.updateBindingContexts(spliceIndexLow);
    }

    viewLookup.forEach(x => {
      if (x instanceof Promise) {
        x.then(y => {
          y.unbind();
          viewsToUnbind--;
          if (viewsToUnbind === 0) {
            this.updateBindingContexts(spliceIndexLow);
          }
        });
      } else {
        x.unbind();
        viewsToUnbind--;
        if (viewsToUnbind === 0) {
          this.updateBindingContexts(spliceIndexLow);
        }
      }
    });
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
        viewSlot.removeAt(removeIndex);
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
        viewSlot.removeAt(removeIndex);
        break;
      case 'clear':
        viewSlot.removeAll();
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

  removeAll() {
    let viewSlot = this.viewSlot;
    let views = viewSlot.children;
    let i;

    viewSlot.removeAll();
    i = views.length;

    while (i--) {
      views[i].unbind();
    }
  }
}
