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
* Binding to iterate over iterable objects (Array, Map and Number) to genereate a template for each iteration.
*/
@customAttribute('repeat')
@templateController
@inject(BoundViewFactory, TargetInstruction, ViewSlot, ViewResources, ObserverLocator, CollectionStrategyLocator)
export class Repeat {
  /**
  * List of items to bind the repeater to.
  *
  * @property items
  */
  @bindable items
  /**
  * Local variable which gets assigned on each iteration.
  *
  * @property local
  */
  @bindable local
  /**
  * Key when iterating over Maps.
  *
  * @property key
  */
  @bindable key
  /**
  * Value when iterating over Maps.
  *
  * @property value
  */
  @bindable value

  /**
 * Creates an instance of Repeat.
 * @param viewFactory The factory generating the view
 * @param instruction The instructions for how the element should be enhanced.
 * @param viewResources Collection of resources used to compile the the views.
 * @param viewSlot The slot the view is injected in to.
 * @param observerLocator The observer locator instance.
 * @param collectionStrategyLocator The strategy locator to locate best strategy to iterate the collection.
 */
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
    this.ignoreMutation = false;
    this.sourceExpression = getSourceExpression(this.instruction, 'repeat.for');
    this.isOneTime = isOneTime(this.sourceExpression);
  }

  call(context, changes) {
    this[context](this.items, changes);
  }

  /**
  * Binds the repeat to the binding context and override context.
  * @param bindingContext The binding context.
  * @param overrideContext An override context for binding.
  */
  bind(bindingContext, overrideContext) {
    let items = this.items;
    this.scope = { bindingContext, overrideContext };
    if (items === undefined || items === null) {
      return;
    }
    this._processItems();
  }

  /**
  * Unbinds the repeat
  */
  unbind() {
    this.scope = null;
    if (this.collectionStrategy) {
      this.collectionStrategy.dispose();
    }
    this.items = null;
    this.collectionStrategy = null;
    this.viewSlot.removeAll(true);
    this._unsubscribeCollection();
  }

  _unsubscribeCollection() {
    if (this.collectionObserver) {
      this.collectionObserver.unsubscribe(this.callContext, this);
      this.collectionObserver = null;
      this.callContext = null;
    }
  }

  /**
  * Invoked everytime item property changes.
  */
  itemsChanged() {
    this._processItems();
  }

  _processItems() {
    let items = this.items;

    this._unsubscribeCollection();
    let rmPromise = this.viewSlot.removeAll(true);
    if (this.collectionStrategy) {
      this.collectionStrategy.dispose();
    }

    if (!items && items !== 0) {
      return;
    }

    let bindingContext;
    let overrideContext;
    if (this.scope) {
      bindingContext = this.scope.bindingContext;
      overrideContext = this.scope.overrideContext;
    }

    this.collectionStrategy = this.collectionStrategyLocator.getStrategy(items);
    this.collectionStrategy.initialize(this, bindingContext, overrideContext);

    if (rmPromise instanceof Promise) {
      rmPromise.then(() => {
        this.processItemsByStrategy();
      });
    } else {
      this.processItemsByStrategy();
    }
  }

  _getInnerCollection() {
    let expression = unwrapExpression(this.sourceExpression);
    if (!expression) {
      return null;
    }
    return expression.evaluate(this.scope, null);
  }

  _observeInnerCollection() {
    let items = this._getInnerCollection();
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

  _observeCollection() {
    let items = this.items;
    this.collectionObserver = this.collectionStrategy.getCollectionObserver(items);
    if (this.collectionObserver) {
      this.callContext = 'handleCollectionChanges';
      this.collectionObserver.subscribe(this.callContext, this);
    }
  }

  processItemsByStrategy() {
    if (!this.isOneTime && !this._observeInnerCollection()) {
      this._observeCollection();
    }
    this.collectionStrategy.processItems(this.items);
  }

  /**
  * Invoked when the underlying collection changes.
  */
  handleCollectionChanges(collection, changes) {
    this.collectionStrategy.handleChanges(collection, changes);
  }

  /**
  * Invoked when the underlying inner collection changes.
  */
  handleInnerCollectionChanges(collection, changes) {
    // guard against source expressions that have observable side-effects that could
    // cause an infinite loop- eg a value converter that mutates the source array.
    if (this.ignoreMutation) {
      return;
    }
    this.ignoreMutation = true;
    let newItems = this.sourceExpression.evaluate(this.scope, this.lookupFunctions);
    this.observerLocator.taskQueue.queueMicroTask(() => this.ignoreMutation = false);

    // collection change?
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

function isOneTime(expression) {
  while (expression instanceof BindingBehavior) {
    if (expression.name === 'oneTime') {
      return true;
    }
    expression = expression.expression;
  }
  return false;
}
