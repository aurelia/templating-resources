/*eslint no-loop-func:0, no-unused-vars:0*/
import {inject} from 'aurelia-dependency-injection';
import {ObserverLocator, calcSplices, getChangeRecords} from 'aurelia-binding';
import {BoundViewFactory, ViewSlot, customAttribute, bindable, templateController} from 'aurelia-templating';
import {CollectionStrategyLocator} from './collection-strategy-locator';

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
@inject(BoundViewFactory, ViewSlot, ObserverLocator, CollectionStrategyLocator)
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
  constructor(viewFactory, viewSlot, observerLocator, collectionStrategyLocator) {
    this.viewFactory = viewFactory;
    this.viewSlot = viewSlot;
    this.observerLocator = observerLocator;
    this.local = 'item';
    this.key = 'key';
    this.value = 'value';
    this.collectionStrategyLocator = collectionStrategyLocator;
  }

  call(context, changes) {
    this[context](this.items, changes);
  }

  bind(bindingContext, overrideContext) {
    let items = this.items;
    if (items === undefined || items === null) {
      return;
    }

    this.collectionStrategy = this.collectionStrategyLocator.getStrategy(this.items);
    this.collectionStrategy.initialize(this, bindingContext, overrideContext);
    this.processItems();
  }

  unbind() {
    this.collectionStrategy.dispose();
    this.items = null;
    this.collectionStrategy = null;
    this.viewSlot.removeAll(true);
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
        this.processItemsByStrategy();
      });
    } else {
      this.processItemsByStrategy();
    }
  }

  processItemsByStrategy() {
    let items = this.items;
    this.collectionObserver = this.collectionStrategy.getCollectionObserver(items);
    this.collectionStrategy.processItems(items);
    if (this.collectionObserver) {
      this.callContext = 'handleChanges';
      this.collectionObserver.subscribe(this.callContext, this);
    }
  }

  handleChanges(collection, changes) {
    this.collectionStrategy.handleChanges(collection, changes);
  }
}
