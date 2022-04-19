/*eslint no-loop-func:0, no-unused-vars:0*/
import {inject} from 'aurelia-dependency-injection';
import {ObserverLocator, BindingExpression} from 'aurelia-binding';
import {
  BoundViewFactory,
  TargetInstruction,
  ViewSlot,
  ViewResources,
  customAttribute,
  bindable,
  templateController,
  View,
  ViewFactory
} from 'aurelia-templating';
import {RepeatStrategyLocator} from './repeat-strategy-locator';
import {
  getItemsSourceExpression,
  unwrapExpression,
  isOneTime,
  updateOneTimeBinding
} from './repeat-utilities';
import {viewsRequireLifecycle} from './analyze-view-factory';
import {AbstractRepeater} from './abstract-repeater';

const matcherExtractionMarker = '__marker_extracted__';

/**
 * Binding to iterate over iterable objects (Array, Map and Number) to genereate a template for each iteration.
 */
@customAttribute('repeat')
@templateController
@inject(BoundViewFactory, TargetInstruction, ViewSlot, ViewResources, ObserverLocator, RepeatStrategyLocator)
export class Repeat extends AbstractRepeater {

  /**
   * Setting this to `true` to enable legacy behavior, where a repeat would take first `matcher` binding
   * any where inside its view if there's no `matcher` binding on the repeated element itself.
   *
   * Default value is true to avoid breaking change
   * @default true
   */
  static useInnerMatcher = true;

  /**
   * List of items to bind the repeater to.
   *
   * @property items
   */
  @bindable items;
  /**
   * Local variable which gets assigned on each iteration.
   *
   * @property local
   */
  @bindable local;
  /**
   * Key when iterating over Maps.
   *
   * @property key
   */
  @bindable key;
  /**
   * Value when iterating over Maps.
   *
   * @property value
   */
  @bindable value;

  /**@internal*/
  viewFactory: any;
  /**@internal*/
  instruction: any;
  /**@internal*/
  viewSlot: any;
  /**@internal*/
  lookupFunctions: any;
  /**@internal*/
  observerLocator: any;
  /**@internal*/
  strategyLocator: any;
  /**@internal*/
  ignoreMutation: boolean;
  /**@internal*/
  sourceExpression: any;
  /**@internal*/
  isOneTime: any;
  /**@internal*/
  viewsRequireLifecycle: any;
  /**@internal*/
  scope: { bindingContext: any; overrideContext: any; };
  /**@internal*/
  matcherBinding: any;
  /**@internal*/
  collectionObserver: any;
  /**@internal*/
  strategy: any;
  /**@internal */
  callContext: 'handleCollectionMutated' | 'handleInnerCollectionMutated';

  /**
 * Creates an instance of Repeat.
 * @param viewFactory The factory generating the view
 * @param instruction The instructions for how the element should be enhanced.
 * @param viewResources Collection of resources used to compile the the views.
 * @param viewSlot The slot the view is injected in to.
 * @param observerLocator The observer locator instance.
 * @param collectionStrategyLocator The strategy locator to locate best strategy to iterate the collection.
 */
  constructor(viewFactory, instruction, viewSlot, viewResources, observerLocator, strategyLocator) {
    super({
      local: 'item',
      viewsRequireLifecycle: viewsRequireLifecycle(viewFactory)
    });

    this.viewFactory = viewFactory;
    this.instruction = instruction;
    this.viewSlot = viewSlot;
    this.lookupFunctions = viewResources.lookupFunctions;
    this.observerLocator = observerLocator;
    this.key = 'key';
    this.value = 'value';
    this.strategyLocator = strategyLocator;
    this.ignoreMutation = false;
    this.sourceExpression = getItemsSourceExpression(this.instruction, 'repeat.for');
    this.isOneTime = isOneTime(this.sourceExpression);
    this.viewsRequireLifecycle = viewsRequireLifecycle(viewFactory);
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
    this.scope = { bindingContext, overrideContext };
    const instruction = this.instruction;
    if (!(matcherExtractionMarker in instruction)) {
      instruction[matcherExtractionMarker] = this._captureAndRemoveMatcherBinding();
    }
    this.matcherBinding = instruction[matcherExtractionMarker];
    this.itemsChanged();
  }

  /**
  * Unbinds the repeat
  */
  unbind() {
    this.scope = null;
    this.items = null;
    this.matcherBinding = null;
    this.viewSlot.removeAll(true, true);
    this._unsubscribeCollection();
  }

  /**
   * @internal
   */
  _unsubscribeCollection() {
    if (this.collectionObserver) {
      this.collectionObserver.unsubscribe(this.callContext, this);
      this.collectionObserver = null;
      this.callContext = null;
    }
  }

  /**
  * Invoked everytime the item property changes.
  */
  itemsChanged() {
    this._unsubscribeCollection();

    // still bound?
    if (!this.scope) {
      return;
    }

    let items = this.items;
    this.strategy = this.strategyLocator.getStrategy(items);
    if (!this.strategy) {
      throw new Error(`Value for '${this.sourceExpression}' is non-repeatable`);
    }

    if (!this.isOneTime && !this._observeInnerCollection()) {
      this._observeCollection();
    }
    this.ignoreMutation = true;
    this.strategy.instanceChanged(this, items);
    this.observerLocator.taskQueue.queueMicroTask(() => {
      this.ignoreMutation = false;
    });
  }

  /**
   * @internal
   */
  _getInnerCollection() {
    let expression = unwrapExpression(this.sourceExpression);
    if (!expression) {
      return null;
    }
    return expression.evaluate(this.scope, null);
  }

  /**
  * Invoked when the underlying collection changes.
  */
  handleCollectionMutated(collection, changes) {
    if (!this.collectionObserver) {
      return;
    }
    if (this.ignoreMutation) {
      return;
    }
    this.strategy.instanceMutated(this, collection, changes);
  }

  /**
  * Invoked when the underlying inner collection changes.
  */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleInnerCollectionMutated(collection, changes) {
    if (!this.collectionObserver) {
      return;
    }
    // guard against source expressions that have observable side-effects that could
    // cause an infinite loop- eg a value converter that mutates the source array.
    if (this.ignoreMutation) {
      return;
    }
    this.ignoreMutation = true;
    let newItems = this.sourceExpression.evaluate(this.scope, this.lookupFunctions);
    this.observerLocator.taskQueue.queueMicroTask(() => this.ignoreMutation = false);

    // call itemsChanged...
    if (newItems === this.items) {
      // call itemsChanged directly.
      this.itemsChanged();
    } else {
      // call itemsChanged indirectly by assigning the new collection value to
      // the items property, which will trigger the self-subscriber to call itemsChanged.
      this.items = newItems;
    }
  }

  /**
   * @internal
   */
  _observeInnerCollection() {
    let items = this._getInnerCollection();
    let strategy = this.strategyLocator.getStrategy(items);
    if (!strategy) {
      return false;
    }
    this.collectionObserver = strategy.getCollectionObserver(this.observerLocator, items);
    if (!this.collectionObserver) {
      return false;
    }
    this.callContext = 'handleInnerCollectionMutated';
    this.collectionObserver.subscribe(this.callContext, this);
    return true;
  }

  /**
   * @internal
   */
  _observeCollection() {
    let items = this.items;
    this.collectionObserver = this.strategy.getCollectionObserver(this.observerLocator, items);
    if (this.collectionObserver) {
      this.callContext = 'handleCollectionMutated';
      this.collectionObserver.subscribe(this.callContext, this);
    }
  }

  /**
   * Capture and remove matcher binding is a way to cache matcher binding + reduce redundant work
   * caused by multiple unnecessary matcher bindings
   * @internal
   */
  _captureAndRemoveMatcherBinding() {
    const viewFactory: ViewFactory = this.viewFactory.viewFactory;
    if (viewFactory) {
      const template = viewFactory.template;
      const instructions = viewFactory.instructions as Record<string, TargetInstruction>;
      // legacy behavior enabled when Repeat.useInnerMathcer === true
      if (Repeat.useInnerMatcher) {
        return extractMatcherBindingExpression(instructions);
      }
      // if the template has more than 1 immediate child element
      // it's a repeat put on a <template/> element
      // not valid for matcher binding
      if (getChildrenCount(template) > 1) {
        return undefined;
      }
      // if the root element does not have any instruction
      // it means there's no matcher binding
      // no need to do any further work
      const repeatedElement = getFirstElementChild(template);
      if (!repeatedElement.hasAttribute('au-target-id')) {
        return undefined;
      }
      const repeatedElementTargetId = repeatedElement.getAttribute('au-target-id');
      return extractMatcherBindingExpression(instructions, repeatedElementTargetId);
    }

    return undefined;
  }

  // @override AbstractRepeater
  viewCount() { return this.viewSlot.children.length; }
  views() { return this.viewSlot.children; }
  view(index) { return this.viewSlot.children[index]; }
  matcher() {
    const matcherBinding = this.matcherBinding;
    return matcherBinding
      ? matcherBinding.sourceExpression.evaluate(this.scope, matcherBinding.lookupFunctions)
      : null;
  }

  addView(bindingContext, overrideContext) {
    let view = this.viewFactory.create();
    view.bind(bindingContext, overrideContext);
    this.viewSlot.add(view);
  }

  insertView(index, bindingContext, overrideContext) {
    let view = this.viewFactory.create();
    view.bind(bindingContext, overrideContext);
    this.viewSlot.insert(index, view);
  }

  moveView(sourceIndex, targetIndex) {
    this.viewSlot.move(sourceIndex, targetIndex);
  }

  removeAllViews(returnToCache, skipAnimation) {
    return this.viewSlot.removeAll(returnToCache, skipAnimation);
  }

  removeViews(viewsToRemove, returnToCache, skipAnimation) {
    return this.viewSlot.removeMany(viewsToRemove, returnToCache, skipAnimation);
  }

  removeView(index, returnToCache, skipAnimation) {
    return this.viewSlot.removeAt(index, returnToCache, skipAnimation);
  }

  updateBindings(view: View) {
    const $view = view as View & { bindings: any[]; controllers: any[] };
    let j = $view.bindings.length;
    while (j--) {
      updateOneTimeBinding($view.bindings[j]);
    }
    j = $view.controllers.length;
    while (j--) {
      let k = $view.controllers[j].boundProperties.length;
      while (k--) {
        let binding = $view.controllers[j].boundProperties[k].binding;
        updateOneTimeBinding(binding);
      }
    }
  }
}

/**
 * Iterate a record of TargetInstruction and their expressions to find first binding expression that targets property named "matcher"
 */
const extractMatcherBindingExpression = (instructions: Record<string, TargetInstruction>, targetedElementId?: string): BindingExpression | undefined => {
  const instructionIds = Object.keys(instructions);
  for (let i = 0; i < instructionIds.length; i++) {
    const instructionId = instructionIds[i];
    // matcher binding can only works when root element is not a <template/>
    // checking first el child
    if (targetedElementId !== undefined && instructionId !== targetedElementId) {
      continue;
    }
    const expressions = instructions[instructionId].expressions as BindingExpression[];
    if (expressions) {
      for (let ii = 0; ii < expressions.length; ii++) {
        if (expressions[ii].targetProperty === 'matcher') {
          const matcherBindingExpression = expressions[ii];
          expressions.splice(ii, 1);
          return matcherBindingExpression;
        }
      }
    }
  }
};

/**
 * Calculate the number of child elements of an element
 *
 * Note: API .childElementCount/.children are not available in IE11
 */
const getChildrenCount = (el: Element | DocumentFragment) => {
  const childNodes = el.childNodes;
  let count = 0;
  for (let i = 0, ii = childNodes.length; ii > i; ++i) {
    if (childNodes[i].nodeType === /* element */1) {
      ++count;
    }
  }
  return count;
};

/**
 * Get the first child element of an element / doc fragment
 *
 * Note: API .firstElementChild is not available in IE11
 */
const getFirstElementChild = (el: Element | DocumentFragment) => {
  let firstChild = el.firstChild as Element;
  while (firstChild !== null) {
    if (firstChild.nodeType === /* element */1) {
      return firstChild;
    }
    firstChild = firstChild.nextSibling as Element;
  }
  return null;
};
