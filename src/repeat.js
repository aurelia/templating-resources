/*eslint no-loop-func:0, no-unused-vars:0*/
import {inject} from 'aurelia-dependency-injection';
import {
  ObserverLocator,
  getChangeRecords,
  BindingBehavior,
  ValueConverter
} from 'aurelia-binding';
import {
  BoundViewFactory,
  TargetInstruction,
  ViewSlot,
  ViewResources,
  customAttribute,
  bindable,
  templateController
} from 'aurelia-templating';
import {CollectionStrategyLocator} from './collection-strategy-locator';

/**
* Binding to iterate over an array and repeat a template
*
* @class Repeat
* @constructor
* @param {BoundViewFactory} viewFactory The factory generating the view
* @param {TargetInstruction} instruction The view instruction
* @param {ViewSlot} viewSlot The slot the view is injected in to
* @param {ViewResources} viewResources The view resources
* @param {ObserverLocator} observerLocator The observer locator instance
*/
@customAttribute('repeat')
@templateController
@inject(BoundViewFactory, TargetInstruction, ViewSlot, ViewResources, ObserverLocator, CollectionStrategyLocator)
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
  constructor(viewFactory, instruction, viewSlot, viewResources, observerLocator, collectionStrategyLocator) {
    this.viewFactory = viewFactory;
    this.instruction = instruction;
    this.viewSlot = viewSlot;
    this.lookupFunctions = viewResources.lookupFunctions;
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

    this.sourceExpression = getSourceExpression(this.instruction, 'repeat.for');
    this.scope = { bindingContext, overrideContext };
    this.collectionStrategy = this.collectionStrategyLocator.getStrategy(this.items);
    this.collectionStrategy.initialize(this, bindingContext, overrideContext);
    this.processItems();
  }

  unbind() {
    this.sourceExpression = null;
    this.scope = null;
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

  getInnerCollection() {
    let expression = unwrapExpression(this.sourceExpression);
    if (!expression) {
      return null;
    }
    return expression.evaluate(this.scope, null);
  }

  observeInnerCollection() {
    let items = this.getInnerCollection();
    if (items instanceof Array) {
      this.collectionObserver = this.observerLocator.getArrayObserver(items);
    } else if (items instanceof Map) {
      this.collectionObserver = this.observerLocator.getMapObserver(items);
    } else {
      return false;
    }
    this.callContext = 'handleInnerCollectionChanges';
    this.collectionObserver.subscribe(this.callContext, this);
    return true;
  }

  observeCollection() {
    let items = this.items;
    this.collectionObserver = this.collectionStrategy.getCollectionObserver(items);
    if (this.collectionObserver) {
      this.callContext = 'handleCollectionChanges';
      this.collectionObserver.subscribe(this.callContext, this);
    }
  }

  processItemsByStrategy() {
    if (!this.observeInnerCollection()) {
      this.observeCollection();
    }
    this.collectionStrategy.processItems(this.items);
  }

  handleCollectionChanges(collection, changes) {
    this.collectionStrategy.handleChanges(collection, changes);
  }

  handleInnerCollectionChanges(collection, changes) {
    let newItems = this.sourceExpression.evaluate(this.scope, this.lookupFunctions);
    if (newItems === this.items) {
      return;
    }
    this.items = newItems;
    this.itemsChanged();
  }
}

function getSourceExpression(instruction, attrName) {
  return instruction.behaviorInstructions
    .filter(bi => bi.originalAttrName === attrName)[0]
    .attributes
    .items
    .sourceExpression;
}

function unwrapExpression(expression) {
  let unwrapped = false;
  while (expression instanceof BindingBehavior) {
    expression = expression.expression;
  }
  while (expression instanceof ValueConverter) {
    expression = expression.expression;
    unwrapped = true;
  }
  return unwrapped ? expression : null;
}
