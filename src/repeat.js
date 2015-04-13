import {inject} from 'aurelia-dependency-injection';
import {ObserverLocator, calcSplices, getChangeRecords} from 'aurelia-binding';
import {BoundViewFactory, ViewSlot, customAttribute, bindable, templateController} from 'aurelia-templating';

@customAttribute('repeat')
@bindable('items')
@bindable('local')
@bindable('key')
@templateController
@inject(BoundViewFactory, ViewSlot, ObserverLocator)
export class Repeat {
  constructor(viewFactory, viewSlot, observerLocator){
    this.viewFactory = viewFactory;
    this.viewSlot = viewSlot;
    this.observerLocator = observerLocator;
    this.local = 'item';
    this.key = 'key';
    this.value = 'value';
  }

  bind(executionContext){
    var items = this.items,
      observer;

    this.executionContext = executionContext;

    if(!items){
      if(this.oldItems){
        this.viewSlot.removeAll();
      }

      return;
    }

    if (this.oldItems === items) {
      if (items instanceof Map) {
        var records = getChangeRecords(items);
        observer = this.observerLocator.getMapObserver(items);

        this.handleMapChangeRecords(items, records);

        this.disposeSubscription = observer.subscribe(records => {
          this.handleMapChangeRecords(items, records);
        });
      } else {
        var splices = calcSplices(items, 0, items.length, this.lastBoundItems, 0, this.lastBoundItems.length);
        observer = this.observerLocator.getArrayObserver(items);

        this.handleSplices(items, splices);
        this.lastBoundItems = this.oldItems = null;

        this.disposeSubscription = observer.subscribe(splices => {
          this.handleSplices(items, splices);
        });
      }
    } else {
      this.processItems();
    }
  }

  unbind(){
    this.oldItems = this.items;

    if(this.items instanceof Array){
      this.lastBoundItems = this.items.slice(0);
    }

    if(this.disposeSubscription){
      this.disposeSubscription();
      this.disposeSubscription = null;
    }
  }

  itemsChanged() {
    this.processItems();
  }

  processItems() {
    var items = this.items,
      viewSlot = this.viewSlot;

    if (this.disposeSubscription) {
      this.disposeSubscription();
      viewSlot.removeAll();
    }

    if(!items){
      return;
    }

    if (items instanceof Map) {
      this.processMapEntries(items);
    } else {
      this.processArrayItems(items);
    }
  }

  processArrayItems(items){
    var viewFactory = this.viewFactory,
      viewSlot = this.viewSlot,
      i, ii, row, view, observer;

    observer = this.observerLocator.getArrayObserver(items);

    for(i = 0, ii = items.length; i < ii; ++i){
      row = this.createFullExecutionContext(items[i], i, ii);
      view = viewFactory.create(row);
      viewSlot.add(view);
    }

    this.disposeSubscription = observer.subscribe(splices => {
      this.handleSplices(items, splices);
    });
  }

  processMapEntries(items) {
    var viewFactory = this.viewFactory,
      viewSlot = this.viewSlot,
      index = 0,
      row, view, observer;

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

  createBaseExecutionContext(data){
    var context = {};
    context[this.local] = data;
    context.$parent = this.executionContext;
    return context;
  }

  createBaseExecutionKvpContext(key, value){
    var context = {};
    context[this.key] = key;
    context[this.value] = value;
    context.$parent = this.executionContext;
    return context;
  }

  createFullExecutionContext(data, index, length){
    var context = this.createBaseExecutionContext(data);
    return this.updateExecutionContext(context, index, length);
  }

  createFullExecutionKvpContext(key, value, index, length){
    var context = this.createBaseExecutionKvpContext(key, value);
    return this.updateExecutionContext(context, index, length);
  }

  updateExecutionContext(context, index, length){
    var first = (index === 0),
        last = (index === length - 1),
        even = index % 2 === 0;

    context.$index = index;
    context.$first = first;
    context.$last = last;
    context.$middle = !(first || last);
    context.$odd = !even;
    context.$even = even;

    return context;
  }

  handleSplices(array, splices) {
    var viewSlot = this.viewSlot,
      spliceIndexLow, view, i, ii, j, jj, row, splice,
      addIndex, end, itemsLeftToAdd,
      removed, model, children, length;

    for (i = 0, ii = splices.length; i < ii; ++i) {
      splice = splices[i];
      addIndex = splice.index;
      itemsLeftToAdd = splice.addedCount;
      end = splice.index + splice.addedCount;
      removed = splice.removed;
      if(typeof spliceIndexLow === 'undefined' || spliceIndexLow === null || spliceIndexLow > splice.index){
        spliceIndexLow = splice.index;
      }

      for (j = 0, jj = removed.length; j < jj; ++j) {
        if (itemsLeftToAdd > 0) {
          view = viewSlot.children[splice.index + j];
          view.executionContext[this.local] = array[addIndex + j];
          --itemsLeftToAdd;
        } else {
          view = viewSlot.removeAt(addIndex + splice.addedCount);
        }
      }

      addIndex += removed.length;

      for (; 0 < itemsLeftToAdd; ++addIndex) {
        model = array[addIndex];
        row = this.createBaseExecutionContext(model);
        view = this.viewFactory.create(row);
        viewSlot.insert(addIndex, view);
        --itemsLeftToAdd;
      }
    }

    children = this.viewSlot.children;
    length = children.length;

    if(spliceIndexLow > 0){
      spliceIndexLow = spliceIndexLow - 1;
    }

    for(; spliceIndexLow < length; ++spliceIndexLow){
      this.updateExecutionContext(children[spliceIndexLow].executionContext, spliceIndexLow, length);
    }
  }

  handleMapChangeRecords(map, records) {
    var viewSlot = this.viewSlot,
      key, i, ii, view, children, length, row, removeIndex, record;

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
      }
    }

    children = viewSlot.children;
    length = children.length;

    for (i = 0; i < length; i++) {
      this.updateExecutionContext(children[i].executionContext, i, length);
    }
  }

  getViewIndexByKey(key) {
    var viewSlot = this.viewSlot,
      i, ii, child;

    for (i = 0, ii = viewSlot.children.length; i < ii; ++i) { // TODO (martingust) better way to get index?
      child = viewSlot.children[i];
      if (child.bindings[0].source[this.key] === key) {
        return i;
      }
    }
  }
}
