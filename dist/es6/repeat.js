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
        this.removeAll();
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

        return;
      }
    } else if (this.oldItems) {
      this.removeAll();
    }

    this.processItems();
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
    var items = this.items;

    if (this.disposeSubscription) {
      this.disposeSubscription();
      this.removeAll();
    }

    if(!items && items !== 0){
      return;
    }

    if (items instanceof Array) {
      this.processArrayItems(items);
    } else if(items instanceof Map) {
      this.processMapEntries(items);
    } else if((typeof items === 'number')){
      this.processNumber(items);
    }else{
      throw new Error('Object in "repeat" must be of type Array, Map or Number');
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

  processNumber(value){
    var viewFactory = this.viewFactory,
      viewSlot = this.viewSlot,
      childrenLength = viewSlot.children.length,
      i, ii, row, view, viewsToRemove;

    value = Math.floor(value);
    viewsToRemove = childrenLength - value;

    if(viewsToRemove > 0) {
      if(viewsToRemove > childrenLength) {
        viewsToRemove = childrenLength;
      }
      for(i = 0, ii = viewsToRemove; i < ii; ++i){
        viewSlot.removeAt(childrenLength - (i + 1));
      }
      return;
    }

    for(i = childrenLength, ii = value; i < ii; ++i){
      row = this.createFullExecutionContext(i, i, ii);
      view = viewFactory.create(row);
      viewSlot.add(view);
    }
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
    var viewLookup = new Map(),
      viewSlot = this.viewSlot,
      spliceIndexLow, viewOrPromise, view,
      i, ii, j, jj, row, splice,
      addIndex, end, itemsLeftToAdd,
      removed, model, children, length, context, spliceIndex;

    for (i = 0, ii = splices.length; i < ii; ++i) {
      splice = splices[i];
      addIndex = spliceIndex = splice.index;
      itemsLeftToAdd = splice.addedCount;
      end = splice.index + splice.addedCount;
      removed = splice.removed;
      if(typeof spliceIndexLow === 'undefined' || spliceIndexLow === null || spliceIndexLow > splice.index){
        spliceIndexLow = spliceIndex;
      }

      for (j = 0, jj = removed.length; j < jj; ++j) {
        if (itemsLeftToAdd > 0) {
          view = viewSlot.children[spliceIndex + j];
          view.detached();
          context = this.createFullExecutionContext(array[addIndex + j], spliceIndex + j, array.length);
          view.bind(context);
          view.attached();
          --itemsLeftToAdd;
        } else {
          viewOrPromise = viewSlot.removeAt(addIndex + splice.addedCount);
          if(viewOrPromise){
            viewLookup.set(removed[j], viewOrPromise);
          }
        }
      }

      addIndex += removed.length;

      for (; 0 < itemsLeftToAdd; ++addIndex) {
        model = array[addIndex];
        viewOrPromise = viewLookup.get(model);
        if(viewOrPromise instanceof Promise){
          ((localAddIndex, localModel) => {
            viewOrPromise.then(view => {
              viewLookup.delete(localModel);
              viewSlot.insert(localAddIndex, view);
            });
          })(addIndex, model);
        }else if(viewOrPromise){
          viewLookup.delete(model);
          viewSlot.insert(addIndex, viewOrPromise);
        }else{
          row = this.createBaseExecutionContext(model);
          view = this.viewFactory.create(row);
          viewSlot.insert(addIndex, view);
        }
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

    viewLookup.forEach(x => {
      if(x instanceof Promise){
        x.then(y => y.unbind());
      }else{
        x.unbind();
      }
    });
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

  removeAll(){
    var viewSlot = this.viewSlot,
      views, i;

    views = viewSlot.children;
    viewSlot.removeAll();
    i = views.length;
    while(i--) {
      views[i].unbind();
    }
  }
}
