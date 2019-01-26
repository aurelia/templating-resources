import {inject,Container,Optional} from 'aurelia-dependency-injection';
import {BoundViewFactory,ViewSlot,customAttribute,templateController,useView,customElement,bindable,ViewResources,resource,ViewCompileInstruction,CompositionEngine,CompositionContext,noView,View,ViewEngine,Animator,TargetInstruction} from 'aurelia-templating';
import {createOverrideContext,bindingMode,EventSubscriber,bindingBehavior,BindingBehavior,ValueConverter,sourceContext,targetContext,DataAttributeObserver,mergeSplice,valueConverter,ObserverLocator} from 'aurelia-binding';
import {TaskQueue} from 'aurelia-task-queue';
import {DOM,FEATURE} from 'aurelia-pal';
import {Loader} from 'aurelia-loader';
import {relativeToFile} from 'aurelia-path';
import {mixin} from 'aurelia-metadata';

/**
* Creates a binding context for decandant elements to bind to.
*/
@customAttribute('with')
@templateController
@inject(BoundViewFactory, ViewSlot)
export class With {
  /**
  * Creates an instance of With.
  * @param viewFactory The factory generating the view.
  * @param viewSlot The slot the view is injected in to.
  */
  constructor(viewFactory, viewSlot) {
    this.viewFactory = viewFactory;
    this.viewSlot = viewSlot;
    this.parentOverrideContext = null;
    this.view = null;
  }

  /**
  * Binds the With with provided binding context and override context.
  * @param bindingContext The binding context.
  * @param overrideContext An override context for binding.
  */
  bind(bindingContext, overrideContext) {
    this.parentOverrideContext = overrideContext;
    this.valueChanged(this.value);
  }

  /**
  * Invoked everytime the bound value changes.
  * @param newValue The new value.
  */
  valueChanged(newValue) {
    let overrideContext = createOverrideContext(newValue, this.parentOverrideContext);
    if (!this.view) {
      this.view = this.viewFactory.create();
      this.view.bind(newValue, overrideContext);
      this.viewSlot.add(this.view);
    } else {
      this.view.bind(newValue, overrideContext);
    }
  }

  /**
  * Unbinds With
  */
  unbind() {
    this.parentOverrideContext = null;

    if (this.view) {
      this.view.unbind();
    }
  }
}

const eventNamesRequired = 'The updateTrigger binding behavior requires at least one event name argument: eg <input value.bind="firstName & updateTrigger:\'blur\'">';
const notApplicableMessage = 'The updateTrigger binding behavior can only be applied to two-way/ from-view bindings on input/select elements.';

@bindingBehavior('updateTrigger')
export class UpdateTriggerBindingBehavior {

  bind(binding, source, ...events) {
    if (events.length === 0) {
      throw new Error(eventNamesRequired);
    }
    if (binding.mode !== bindingMode.twoWay && binding.mode !== bindingMode.fromView) {
      throw new Error(notApplicableMessage);
    }

    // ensure the binding's target observer has been set.
    let targetObserver = binding.observerLocator.getObserver(binding.target, binding.targetProperty);
    if (!targetObserver.handler) {
      throw new Error(notApplicableMessage);
    }
    binding.targetObserver = targetObserver;

    // stash the original element subscribe function.
    targetObserver.originalHandler = binding.targetObserver.handler;

    // replace the element subscribe function with one that uses the correct events.
    let handler = new EventSubscriber(events);
    targetObserver.handler = handler;
  }

  unbind(binding, source) {
    // restore the state of the binding.
    binding.targetObserver.handler.dispose();
    binding.targetObserver.handler = binding.targetObserver.originalHandler;
    binding.targetObserver.originalHandler = null;
  }
}

function throttle(newValue) {
  let state = this.throttleState;
  let elapsed = +new Date() - state.last;
  if (elapsed >= state.delay) {
    clearTimeout(state.timeoutId);
    state.timeoutId = null;
    state.last = +new Date();
    this.throttledMethod(newValue);
    return;
  }
  state.newValue = newValue;
  if (state.timeoutId === null) {
    state.timeoutId = setTimeout(
      () => {
        state.timeoutId = null;
        state.last = +new Date();
        this.throttledMethod(state.newValue);
      },
      state.delay - elapsed);
  }
}

@bindingBehavior('throttle')
export class ThrottleBindingBehavior {
  bind(binding, source, delay = 200) {
    // determine which method to throttle.
    let methodToThrottle = 'updateTarget'; // one-way bindings or interpolation bindings
    if (binding.callSource) {
      methodToThrottle = 'callSource';     // listener and call bindings
    } else if (binding.updateSource && binding.mode === bindingMode.twoWay) {
      methodToThrottle = 'updateSource';   // two-way bindings
    }

    // stash the original method and it's name.
    // note: a generic name like "originalMethod" is not used to avoid collisions
    // with other binding behavior types.
    binding.throttledMethod = binding[methodToThrottle];
    binding.throttledMethod.originalName = methodToThrottle;

    // replace the original method with the throttling version.
    binding[methodToThrottle] = throttle;

    // create the throttle state.
    binding.throttleState = {
      delay: delay,
      last: 0,
      timeoutId: null
    };
  }

  unbind(binding, source) {
    // restore the state of the binding.
    let methodToRestore = binding.throttledMethod.originalName;
    binding[methodToRestore] = binding.throttledMethod;
    binding.throttledMethod = null;
    clearTimeout(binding.throttleState.timeoutId);
    binding.throttleState = null;
  }
}

function findOriginalEventTarget(event) {
  return (event.path && event.path[0]) || (event.deepPath && event.deepPath[0]) || event.target;
}

function handleSelfEvent(event) {
  let target = findOriginalEventTarget(event);
  if (this.target !== target) return;
  this.selfEventCallSource(event);
}

@bindingBehavior('self')
export class SelfBindingBehavior {
  bind(binding, source) {
    if (!binding.callSource || !binding.targetEvent) throw new Error('Self binding behavior only supports event.');
    binding.selfEventCallSource = binding.callSource;
    binding.callSource = handleSelfEvent;
  }

  unbind(binding, source) {
    binding.callSource = binding.selfEventCallSource;
    binding.selfEventCallSource = null;
  }
}

/**
* Marks any part of a view to be replacable by the consumer.
*/
@customAttribute('replaceable')
@templateController
@inject(BoundViewFactory, ViewSlot)
export class Replaceable {

  /**
  * @param viewFactory target The factory generating the view.
  * @param viewSlot viewSlot The slot the view is injected in to.
  */
  constructor(viewFactory, viewSlot) {
    this.viewFactory = viewFactory; //This is referenced internally in the Controller's bind method.
    this.viewSlot = viewSlot;
    this.view = null;
  }

  /**
  * Binds the replaceable to the binding context and override context.
  * @param bindingContext The binding context.
  * @param overrideContext An override context for binding.
  */
  bind(bindingContext, overrideContext) {
    if (this.view === null) {
      this.view = this.viewFactory.create();
      this.viewSlot.add(this.view);
    }

    this.view.bind(bindingContext, overrideContext);
  }

  /**
  * Unbinds the replaceable.
  */
  unbind() {
    this.view.unbind();
  }
}

const oneTime = bindingMode.oneTime;

/**
* Update the override context.
* @param startIndex index in collection where to start updating.
*/
export function updateOverrideContexts(views, startIndex) {
  let length = views.length;

  if (startIndex > 0) {
    startIndex = startIndex - 1;
  }

  for (; startIndex < length; ++startIndex) {
    updateOverrideContext(views[startIndex].overrideContext, startIndex, length);
  }
}

/**
  * Creates a complete override context.
  * @param data The item's value.
  * @param index The item's index.
  * @param length The collections total length.
  * @param key The key in a key/value pair.
  */
export function createFullOverrideContext(repeat, data, index, length, key) {
  let bindingContext = {};
  let overrideContext = createOverrideContext(bindingContext, repeat.scope.overrideContext);
  // is key/value pair (Map)
  if (typeof key !== 'undefined') {
    bindingContext[repeat.key] = key;
    bindingContext[repeat.value] = data;
  } else {
    bindingContext[repeat.local] = data;
  }
  updateOverrideContext(overrideContext, index, length);
  return overrideContext;
}

/**
* Updates the override context.
* @param context The context to be updated.
* @param index The context's index.
* @param length The collection's length.
*/
export function updateOverrideContext(overrideContext, index, length) {
  let first = (index === 0);
  let last = (index === length - 1);
  let even = index % 2 === 0;

  overrideContext.$index = index;
  overrideContext.$first = first;
  overrideContext.$last = last;
  overrideContext.$middle = !(first || last);
  overrideContext.$odd = !even;
  overrideContext.$even = even;
}

/**
* Gets a repeat instruction's source expression.
*/
export function getItemsSourceExpression(instruction, attrName) {
  return instruction.behaviorInstructions
    .filter(bi => bi.originalAttrName === attrName)[0]
    .attributes
    .items
    .sourceExpression;
}

/**
* Unwraps an expression to expose the inner, pre-converted / behavior-free expression.
*/
export function unwrapExpression(expression) {
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

/**
* Returns whether an expression has the OneTimeBindingBehavior applied.
*/
export function isOneTime(expression) {
  while (expression instanceof BindingBehavior) {
    if (expression.name === 'oneTime') {
      return true;
    }
    expression = expression.expression;
  }
  return false;
}

/**
* Forces a binding instance to reevaluate.
*/
export function updateOneTimeBinding(binding) {
  if (binding.call && binding.mode === oneTime) {
    binding.call(sourceContext);
  } else if (binding.updateOneTimeBindings) {
    binding.updateOneTimeBindings();
  }
}

/**
 * Returns the index of the element in an array, optionally using a matcher function.
 */
export function indexOf(array, item, matcher, startIndex) {
  if (!matcher) {
    // native indexOf is more performant than a for loop
    return array.indexOf(item);
  }
  const length = array.length;
  for (let index = startIndex || 0; index < length; index++) {
    if (matcher(array[index], item)) {
      return index;
    }
  }
  return -1;
}

/**
* A strategy for repeating a template over null or undefined (does nothing)
*/
export class NullRepeatStrategy {
  instanceChanged(repeat, items) {
    repeat.removeAllViews(true);
  }

  getCollectionObserver(observerLocator, items) {
  }
}

/**
* For internal use only. May change without warning.
*/
export class IfCore {
  constructor(viewFactory, viewSlot) {
    this.viewFactory = viewFactory;
    this.viewSlot = viewSlot;
    this.view = null;
    this.bindingContext = null;
    this.overrideContext = null;
    // If the child view is animated, `value` might not reflect the internal
    // state anymore, so we use `showing` for that.
    // Eventually, `showing` and `value` should be consistent.
    this.showing = false;
    this.cache = true;
  }

  bind(bindingContext, overrideContext) {
    // Store parent bindingContext, so we can pass it down
    this.bindingContext = bindingContext;
    this.overrideContext = overrideContext;
  }

  unbind() {
    if (this.view === null) {
      return;
    }

    this.view.unbind();

    // It seems to me that this code is subject to race conditions when animating.
    // For example a view could be returned to the cache and reused while it's still
    // attached to the DOM and animated.
    if (!this.viewFactory.isCaching) {
      return;
    }

    if (this.showing) {
      this.showing = false;
      this.viewSlot.remove(this.view, /*returnToCache:*/true, /*skipAnimation:*/true);
    } else {
      this.view.returnToCache();
    }

    this.view = null;
  }

  _show() {
    if (this.showing) {
      // Ensures the view is bound.
      // It might not be the case when the if was unbound but not detached, then rebound.
      // Typical case where this happens is nested ifs
      if (!this.view.isBound) {
        this.view.bind(this.bindingContext, this.overrideContext);
      }
      return;
    }

    if (this.view === null) {
      this.view = this.viewFactory.create();
    }

    if (!this.view.isBound) {
      this.view.bind(this.bindingContext, this.overrideContext);
    }

    this.showing = true;
    return this.viewSlot.add(this.view); // Promise or void
  }

  _hide() {
    if (!this.showing) {
      return;
    }

    this.showing = false;
    let removed = this.viewSlot.remove(this.view); // Promise or View

    if (removed instanceof Promise) {
      return removed.then(() => {
        this._unbindView();
      });
    }

    this._unbindView();
  }

  _unbindView() {
    const cache = this.cache === 'false' ? false : !!this.cache;
    this.view.unbind();
    if (!cache) {
      this.view = null;
    }
  }
}

const SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

/**
* Default Html Sanitizer to prevent script injection.
*/
export class HTMLSanitizer {
  /**
  * Sanitizes the provided input.
  * @param input The input to be sanitized.
  */
  sanitize(input) {
    return input.replace(SCRIPT_REGEX, '');
  }
}

/**
* CustomAttribute that binds provided DOM element's focus attribute with a property on the viewmodel.
*/
@customAttribute('focus', bindingMode.twoWay)
export class Focus {

  static inject() {
    return [DOM.Element, TaskQueue];
  }
  /**
  * Creates an instance of Focus.
  * @paramelement Target element on where attribute is placed on.
  * @param taskQueue The TaskQueue instance.
  */
  constructor(element, taskQueue) {
    this.element = element;
    this.taskQueue = taskQueue;
    this.isAttached = false;
    this.needsApply = false;
  }

  /**
  * Invoked everytime the bound value changes.
  * @param newValue The new value.
  */
  valueChanged(newValue) {
    if (this.isAttached) {
      this._apply();
    } else {
      this.needsApply = true;
    }
  }

  _apply() {
    if (this.value) {
      this.taskQueue.queueMicroTask(() => {
        if (this.value) {
          this.element.focus();
        }
      });
    } else {
      this.element.blur();
    }
  }

  /**
  * Invoked when the attribute is attached to the DOM.
  */
  attached() {
    this.isAttached = true;
    if (this.needsApply) {
      this.needsApply = false;
      this._apply();
    }
    this.element.addEventListener('focus', this);
    this.element.addEventListener('blur', this);
  }

  /**
  * Invoked when the attribute is detached from the DOM.
  */
  detached() {
    this.isAttached = false;
    this.element.removeEventListener('focus', this);
    this.element.removeEventListener('blur', this);
  }

  handleEvent(e) {
    if (e.type === 'focus') {
      this.value = true;
    } else if (DOM.activeElement !== this.element) {
      this.value = false;
    }
  }
}

/*eslint padded-blocks:0*/
export function _createDynamicElement(name: string, viewUrl: string, bindableNames: string[]): Function {
  @customElement(name)
  @useView(viewUrl)
  class DynamicElement {
    bind(bindingContext) {
      this.$parent = bindingContext;
    }
  }
  for (let i = 0, ii = bindableNames.length; i < ii; ++i) {
    bindable(bindableNames[i])(DynamicElement);
  }
  return DynamicElement;
}

const unset = {};

function debounceCallSource(event) {
  const state = this.debounceState;
  clearTimeout(state.timeoutId);
  state.timeoutId = setTimeout(() => this.debouncedMethod(event), state.delay);
}

function debounceCall(context, newValue, oldValue) {
  const state = this.debounceState;
  clearTimeout(state.timeoutId);
  if (context !== state.callContextToDebounce) {
    state.oldValue = unset;
    this.debouncedMethod(context, newValue, oldValue);
    return;
  }
  if (state.oldValue === unset) {
    state.oldValue = oldValue;
  }
  state.timeoutId = setTimeout(() => {
    const _oldValue = state.oldValue;
    state.oldValue = unset;
    this.debouncedMethod(context, newValue, _oldValue);
  }, state.delay);
}

@bindingBehavior('debounce')
export class DebounceBindingBehavior {
  bind(binding, source, delay = 200) {
    const isCallSource = binding.callSource !== undefined;
    const methodToDebounce = isCallSource ? 'callSource' : 'call';
    const debouncer = isCallSource ? debounceCallSource : debounceCall;
    const mode = binding.mode;
    const callContextToDebounce = mode === bindingMode.twoWay || mode === bindingMode.fromView ? targetContext : sourceContext;

    // stash the original method and it's name.
    // note: a generic name like "originalMethod" is not used to avoid collisions
    // with other binding behavior types.
    binding.debouncedMethod = binding[methodToDebounce];
    binding.debouncedMethod.originalName = methodToDebounce;

    // replace the original method with the debouncing version.
    binding[methodToDebounce] = debouncer;

    // create the debounce state.
    binding.debounceState = {
      callContextToDebounce,
      delay,
      timeoutId: 0,
      oldValue: unset
    };
  }

  unbind(binding, source) {
    // restore the state of the binding.
    const methodToRestore = binding.debouncedMethod.originalName;
    binding[methodToRestore] = binding.debouncedMethod;
    binding.debouncedMethod = null;
    clearTimeout(binding.debounceState.timeoutId);
    binding.debounceState = null;
  }
}

/*eslint new-cap:0, padded-blocks:0*/
let cssUrlMatcher = /url\((?!['"]data)([^)]+)\)/gi;

function fixupCSSUrls(address, css) {
  if (typeof css !== 'string') {
    throw new Error(`Failed loading required CSS file: ${address}`);
  }
  return css.replace(cssUrlMatcher, (match, p1) => {
    let quote = p1.charAt(0);
    if (quote === '\'' || quote === '"') {
      p1 = p1.substr(1, p1.length - 2);
    }
    return 'url(\'' + relativeToFile(p1, address) + '\')';
  });
}

class CSSResource {
  constructor(address: string) {
    this.address = address;
    this._scoped = null;
    this._global = false;
    this._alreadyGloballyInjected = false;
  }

  initialize(container: Container, target: Function): void {
    this._scoped = new target(this);
  }

  register(registry: ViewResources, name?: string): void {
    if (name === 'scoped') {
      registry.registerViewEngineHooks(this._scoped);
    } else {
      this._global = true;
    }
  }

  load(container: Container): Promise<CSSResource> {
    return container.get(Loader)
      .loadText(this.address)
      .catch(err => null)
      .then(text => {
        text = fixupCSSUrls(this.address, text);
        this._scoped.css = text;
        if (this._global) {
          this._alreadyGloballyInjected = true;
          DOM.injectStyles(text);
        }
      });
  }
}

class CSSViewEngineHooks {
  constructor(owner: CSSResource) {
    this.owner = owner;
    this.css = null;
  }

  beforeCompile(content: DocumentFragment, resources: ViewResources, instruction: ViewCompileInstruction): void {
    if (instruction.targetShadowDOM) {
      DOM.injectStyles(this.css, content, true);
    } else if (FEATURE.scopedCSS) {
      let styleNode = DOM.injectStyles(this.css, content, true);
      styleNode.setAttribute('scoped', 'scoped');
    } else if (this._global && !this.owner._alreadyGloballyInjected) {
      DOM.injectStyles(this.css);
      this.owner._alreadyGloballyInjected = true;
    }
  }
}

export function _createCSSResource(address: string): Function {
  @resource(new CSSResource(address))
  class ViewCSS extends CSSViewEngineHooks {}
  return ViewCSS;
}

/**
* Used to compose a new view / view-model template or bind to an existing instance.
*/
@customElement('compose')
@noView
export class Compose {

  static inject() {
    return [DOM.Element, Container, CompositionEngine, ViewSlot, ViewResources, TaskQueue];
  }
  /**
  * Model to bind the custom element to.
  *
  * @property model
  * @type {CustomElement}
  */
  @bindable model;
  /**
  * View to bind the custom element to.
  *
  * @property view
  * @type {HtmlElement}
  */
  @bindable view;
  /**
  * View-model to bind the custom element's template to.
  *
  * @property viewModel
  * @type {Class}
  */
  @bindable viewModel;

  /**
   * SwapOrder to control the swapping order of the custom element's view.
   *
   * @property view
   * @type {String}
   */
  @bindable swapOrder;

  /**
  * Creates an instance of Compose.
  * @param element The Compose element.
  * @param container The dependency injection container instance.
  * @param compositionEngine CompositionEngine instance to compose the element.
  * @param viewSlot The slot the view is injected in to.
  * @param viewResources Collection of resources used to compile the the view.
  * @param taskQueue The TaskQueue instance.
  */
  constructor(element, container, compositionEngine, viewSlot, viewResources, taskQueue) {
    this.element = element;
    this.container = container;
    this.compositionEngine = compositionEngine;
    this.viewSlot = viewSlot;
    this.viewResources = viewResources;
    this.taskQueue = taskQueue;
    this.currentController = null;
    this.currentViewModel = null;
    this.changes = Object.create(null);
  }

  /**
  * Invoked when the component has been created.
  *
  * @param owningView The view that this component was created inside of.
  */
  created(owningView: View) {
    this.owningView = owningView;
  }

  /**
  * Used to set the bindingContext.
  *
  * @param bindingContext The context in which the view model is executed in.
  * @param overrideContext The context in which the view model is executed in.
  */
  bind(bindingContext, overrideContext) {
    this.bindingContext = bindingContext;
    this.overrideContext = overrideContext;
    this.changes.view = this.view;
    this.changes.viewModel = this.viewModel;
    this.changes.model = this.model;
    if (!this.pendingTask) {
      processChanges(this);
    }
  }

  /**
  * Unbinds the Compose.
  */
  unbind() {
    this.changes = Object.create(null);
    this.bindingContext = null;
    this.overrideContext = null;
    let returnToCache = true;
    let skipAnimation = true;
    this.viewSlot.removeAll(returnToCache, skipAnimation);
  }

  /**
  * Invoked everytime the bound model changes.
  * @param newValue The new value.
  * @param oldValue The old value.
  */
  modelChanged(newValue, oldValue) {
    this.changes.model = newValue;
    requestUpdate(this);
  }

  /**
  * Invoked everytime the bound view changes.
  * @param newValue The new value.
  * @param oldValue The old value.
  */
  viewChanged(newValue, oldValue) {
    this.changes.view = newValue;
    requestUpdate(this);
  }

  /**
    * Invoked everytime the bound view model changes.
    * @param newValue The new value.
    * @param oldValue The old value.
    */
  viewModelChanged(newValue, oldValue) {
    this.changes.viewModel = newValue;
    requestUpdate(this);
  }
}

function isEmpty(obj) {
  for (const key in obj) {
    return false;
  }
  return true;
}

function tryActivateViewModel(vm, model) {
  if (vm && typeof vm.activate === 'function') {
    return Promise.resolve(vm.activate(model));
  }
}

function createInstruction(composer: Compose, instruction: CompositionContext): CompositionContext {
  return Object.assign(instruction, {
    bindingContext: composer.bindingContext,
    overrideContext: composer.overrideContext,
    owningView: composer.owningView,
    container: composer.container,
    viewSlot: composer.viewSlot,
    viewResources: composer.viewResources,
    currentController: composer.currentController,
    host: composer.element,
    swapOrder: composer.swapOrder
  });
}

function processChanges(composer: Compose) {
  const changes = composer.changes;
  composer.changes = Object.create(null);

  if (!('view' in changes) && !('viewModel' in changes) && ('model' in changes)) {
    // just try to activate the current view model
    composer.pendingTask = tryActivateViewModel(composer.currentViewModel, changes.model);
    if (!composer.pendingTask) { return; }
  } else {
    // init context
    let instruction = {
      view: composer.view,
      viewModel: composer.currentViewModel || composer.viewModel,
      model: composer.model
    };

    // apply changes
    instruction = Object.assign(instruction, changes);

    // create context
    instruction = createInstruction(composer, instruction);
    composer.pendingTask = composer.compositionEngine.compose(instruction).then(controller => {
      composer.currentController = controller;
      composer.currentViewModel = controller ? controller.viewModel : null;
    });
  }

  composer.pendingTask = composer.pendingTask
    .then(() => {
      completeCompositionTask(composer);
    }, reason => {
      completeCompositionTask(composer);
      throw reason;
    });
}

function completeCompositionTask(composer) {
  composer.pendingTask = null;
  if (!isEmpty(composer.changes)) {
    processChanges(composer);
  }
}

function requestUpdate(composer: Compose) {
  if (composer.pendingTask || composer.updateRequested) { return; }
  composer.updateRequested = true;
  composer.taskQueue.queueMicroTask(() => {
    composer.updateRequested = false;
    processChanges(composer);
  });
}

export class BindingSignaler {
  signals = {};

  signal(name: string): void {
    let bindings = this.signals[name];
    if (!bindings) {
      return;
    }
    let i = bindings.length;
    while (i--) {
      bindings[i].call(sourceContext);
    }
  }
}

let modeBindingBehavior = {
  bind(binding, source, lookupFunctions) {
    binding.originalMode = binding.mode;
    binding.mode = this.mode;
  },

  unbind(binding, source) {
    binding.mode = binding.originalMode;
    binding.originalMode = null;
  }
};

@mixin(modeBindingBehavior)
@bindingBehavior('oneTime')
export class OneTimeBindingBehavior {
  constructor() {
    this.mode = bindingMode.oneTime;
  }
}

@mixin(modeBindingBehavior)
@bindingBehavior('oneWay')
export class OneWayBindingBehavior {
  constructor() {
    this.mode = bindingMode.toView;
  }
}

@mixin(modeBindingBehavior)
@bindingBehavior('toView')
export class ToViewBindingBehavior {
  constructor() {
    this.mode = bindingMode.toView;
  }
}

@mixin(modeBindingBehavior)
@bindingBehavior('fromView')
export class FromViewBindingBehavior {
  constructor() {
    this.mode = bindingMode.fromView;
  }
}

@mixin(modeBindingBehavior)
@bindingBehavior('twoWay')
export class TwoWayBindingBehavior {
  constructor() {
    this.mode = bindingMode.twoWay;
  }
}

export const aureliaHideClassName = 'aurelia-hide';

const aureliaHideClass = `.${aureliaHideClassName} { display:none !important; }`;

export function injectAureliaHideStyleAtHead() {
  DOM.injectStyles(aureliaHideClass);
}

export function injectAureliaHideStyleAtBoundary(domBoundary) {
  if (FEATURE.shadowDOM && domBoundary && !domBoundary.hasAureliaHideStyle) {
    domBoundary.hasAureliaHideStyle = true;
    DOM.injectStyles(aureliaHideClass, domBoundary);
  }
}

@bindingBehavior('attr')
export class AttrBindingBehavior {
  bind(binding, source) {
    binding.targetObserver = new DataAttributeObserver(binding.target, binding.targetProperty);
  }

  unbind(binding, source) {}
}

/**
* Behaviors that do not require the composition lifecycle callbacks when replacing
* their binding context.
*/
export const lifecycleOptionalBehaviors = ['focus', 'if', 'else', 'repeat', 'show', 'hide', 'with'];

function behaviorRequiresLifecycle(instruction) {
  let t = instruction.type;
  let name = t.elementName !== null ? t.elementName : t.attributeName;
  return lifecycleOptionalBehaviors.indexOf(name) === -1 && (t.handlesAttached || t.handlesBind || t.handlesCreated || t.handlesDetached || t.handlesUnbind)
    || t.viewFactory && viewsRequireLifecycle(t.viewFactory)
    || instruction.viewFactory && viewsRequireLifecycle(instruction.viewFactory);
}

function targetRequiresLifecycle(instruction) {
  // check each behavior instruction.
  let behaviors = instruction.behaviorInstructions;
  if (behaviors) {
    let i = behaviors.length;
    while (i--) {
      if (behaviorRequiresLifecycle(behaviors[i])) {
        return true;
      }
    }
  }

  // check the instruction's view factory (if it has one).
  return instruction.viewFactory && viewsRequireLifecycle(instruction.viewFactory);
}

export function viewsRequireLifecycle(viewFactory) {
  // already analyzed?
  if ('_viewsRequireLifecycle' in viewFactory) {
    return viewFactory._viewsRequireLifecycle;
  }

  // set prop to avoid infinite recursion.
  viewFactory._viewsRequireLifecycle = false;

  // access inner view factory.
  if (viewFactory.viewFactory) {
    viewFactory._viewsRequireLifecycle = viewsRequireLifecycle(viewFactory.viewFactory);
    return viewFactory._viewsRequireLifecycle;
  }

  // template uses animation?
  if (viewFactory.template.querySelector('.au-animate')) {
    viewFactory._viewsRequireLifecycle = true;
    return true;
  }

  // target instructions require lifecycle?
  for (let id in viewFactory.instructions) {
    if (targetRequiresLifecycle(viewFactory.instructions[id])) {
      viewFactory._viewsRequireLifecycle = true;
      return true;
    }
  }

  // safe to skip lifecycle.
  viewFactory._viewsRequireLifecycle = false;
  return false;
}

/**
* An abstract base class for elements and attributes that repeat
* views.
*/
export class AbstractRepeater {
  constructor(options) {
    Object.assign(this, {
      local: 'items',
      viewsRequireLifecycle: true
    }, options);
  }

  /**
   * Returns the number of views the repeater knows about.
   *
   * @return {Number}  the number of views.
   */
  viewCount() {
    throw new Error('subclass must implement `viewCount`');
  }

  /**
   * Returns all of the repeaters views as an array.
   *
   * @return {Array} The repeater's array of views;
   */
  views() {
    throw new Error('subclass must implement `views`');
  }

  /**
   * Returns a single view from the repeater at the provided index.
   *
   * @param {Number} index The index of the requested view.
   * @return {View|ViewSlot} The requested view.
   */
  view(index) {
    throw new Error('subclass must implement `view`');
  }

  /**
   * Returns the matcher function to be used by the repeater, or null if strict matching is to be performed.
   *
   * @return {Function|null} The requested matcher function.
   */
  matcher() {
    throw new Error('subclass must implement `matcher`');
  }

  /**
   * Adds a view to the repeater, binding the view to the
   * provided contexts.
   *
   * @param {Object} bindingContext The binding context to bind the new view to.
   * @param {Object} overrideContext A secondary binding context that can override the primary context.
   */
  addView(bindingContext, overrideContext) {
    throw new Error('subclass must implement `addView`');
  }

  /**
   * Inserts a view to the repeater at a specific index, binding the view to the
   * provided contexts.
   *
   * @param {Number} index The index at which to create the new view at.
   * @param {Object} bindingContext The binding context to bind the new view to.
   * @param {Object} overrideContext A secondary binding context that can override the primary context.
   */
  insertView(index, bindingContext, overrideContext) {
    throw new Error('subclass must implement `insertView`');
  }

  /**
   * Moves a view across the repeater.
   *
   * @param {Number} sourceIndex The index of the view to be moved.
   * @param {Number} sourceIndex The index where the view should be placed at.
   */
  moveView(sourceIndex, targetIndex) {
    throw new Error('subclass must implement `moveView`');
  }

  /**
   * Removes all views from the repeater.
   * @param {Boolean} returnToCache Should the view be returned to the view cache?
   * @param {Boolean} skipAnimation Should the removal animation be skipped?
   * @return {Promise|null}
   */
  removeAllViews(returnToCache?: boolean, skipAnimation?: boolean) {
    throw new Error('subclass must implement `removeAllViews`');
  }

  /**
   * Removes an array of Views from the repeater.
   *
   * @param {Array} viewsToRemove The array of views to be removed.
   * @param {Boolean} returnToCache Should the view be returned to the view cache?
   * @param {Boolean} skipAnimation Should the removal animation be skipped?
   * @return {Promise|null}
   */
  removeViews(viewsToRemove: Array<View>, returnToCache?: boolean, skipAnimation?: boolean) {
    throw new Error('subclass must implement `removeView`');
  }

  /**
   * Removes a view from the repeater at a specific index.
   *
   * @param {Number} index The index of the view to be removed.
   * @param {Boolean} returnToCache Should the view be returned to the view cache?
   * @param {Boolean} skipAnimation Should the removal animation be skipped?
   * @return {Promise|null}
   */
  removeView(index: number, returnToCache?: boolean, skipAnimation?: boolean) {
    throw new Error('subclass must implement `removeView`');
  }

  /**
   * Forces a particular view to update it's bindings, called as part of
   * an in-place processing of items for better performance
   *
   * @param {Object} view the target view for bindings updates
   */
  updateBindings(view: View) {
    throw new Error('subclass must implement `updateBindings`');
  }
}

/**
* A strategy for repeating a template over an array.
*/
export class ArrayRepeatStrategy {
  /**
  * Gets an observer for the specified collection.
  * @param observerLocator The observer locator instance.
  * @param items The items to be observed.
  */
  getCollectionObserver(observerLocator, items) {
    return observerLocator.getArrayObserver(items);
  }

  /**
  * Handle the repeat's collection instance changing.
  * @param repeat The repeater instance.
  * @param items The new array instance.
  */
  instanceChanged(repeat, items) {
    const itemsLength = items.length;

    // if the new instance does not contain any items,
    // just remove all views and don't do any further processing
    if (!items || itemsLength === 0) {
      repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
      return;
    }

    const children = repeat.views();
    const viewsLength = children.length;

    // likewise, if we previously didn't have any views,
    // simply make them and return
    if (viewsLength === 0) {
      this._standardProcessInstanceChanged(repeat, items);
      return;
    }

    if (repeat.viewsRequireLifecycle) {
      const childrenSnapshot = children.slice(0);
      const itemNameInBindingContext = repeat.local;
      const matcher = repeat.matcher();

      // the cache of the current state (it will be transformed along with the views to keep track of indicies)
      let itemsPreviouslyInViews = [];
      const viewsToRemove = [];

      for (let index = 0; index < viewsLength; index++) {
        const view = childrenSnapshot[index];
        const oldItem = view.bindingContext[itemNameInBindingContext];

        if (indexOf(items, oldItem, matcher) === -1) {
          // remove the item if no longer in the new instance of items
          viewsToRemove.push(view);
        } else {
          // or add the item to the cache list
          itemsPreviouslyInViews.push(oldItem);
        }
      }

      let updateViews;
      let removePromise;

      if (itemsPreviouslyInViews.length > 0) {
        removePromise = repeat.removeViews(viewsToRemove, true, !repeat.viewsRequireLifecycle);
        updateViews = () => {
          // update views (create new and move existing)
          for (let index = 0; index < itemsLength; index++) {
            const item = items[index];
            const indexOfView = indexOf(itemsPreviouslyInViews, item, matcher, index);
            let view;

            if (indexOfView === -1) { // create views for new items
              const overrideContext = createFullOverrideContext(repeat, items[index], index, itemsLength);
              repeat.insertView(index, overrideContext.bindingContext, overrideContext);
              // reflect the change in our cache list so indicies are valid
              itemsPreviouslyInViews.splice(index, 0, undefined);
            } else if (indexOfView === index) { // leave unchanged items
              view = children[indexOfView];
              itemsPreviouslyInViews[indexOfView] = undefined;
            } else { // move the element to the right place
              view = children[indexOfView];
              repeat.moveView(indexOfView, index);
              itemsPreviouslyInViews.splice(indexOfView, 1);
              itemsPreviouslyInViews.splice(index, 0, undefined);
            }

            if (view) {
              updateOverrideContext(view.overrideContext, index, itemsLength);
            }
          }

          // remove extraneous elements in case of duplicates,
          // also update binding contexts if objects changed using the matcher function
          this._inPlaceProcessItems(repeat, items);
        };
      } else {
        // if all of the items are different, remove all and add all from scratch
        removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
        updateViews = () => this._standardProcessInstanceChanged(repeat, items);
      }

      if (removePromise instanceof Promise) {
        removePromise.then(updateViews);
      } else {
        updateViews();
      }
    } else {
      // no lifecycle needed, use the fast in-place processing
      this._inPlaceProcessItems(repeat, items);
    }
  }

  _standardProcessInstanceChanged(repeat, items) {
    for (let i = 0, ii = items.length; i < ii; i++) {
      let overrideContext = createFullOverrideContext(repeat, items[i], i, ii);
      repeat.addView(overrideContext.bindingContext, overrideContext);
    }
  }

  _inPlaceProcessItems(repeat, items) {
    let itemsLength = items.length;
    let viewsLength = repeat.viewCount();
    // remove unneeded views.
    while (viewsLength > itemsLength) {
      viewsLength--;
      repeat.removeView(viewsLength, true, !repeat.viewsRequireLifecycle);
    }
    // avoid repeated evaluating the property-getter for the "local" property.
    let local = repeat.local;
    // re-evaluate bindings on existing views.
    for (let i = 0; i < viewsLength; i++) {
      let view = repeat.view(i);
      let last = i === itemsLength - 1;
      let middle = i !== 0 && !last;
      // any changes to the binding context?
      if (view.bindingContext[local] === items[i]
        && view.overrideContext.$middle === middle
        && view.overrideContext.$last === last) {
        // no changes. continue...
        continue;
      }
      // update the binding context and refresh the bindings.
      view.bindingContext[local] = items[i];
      view.overrideContext.$middle = middle;
      view.overrideContext.$last = last;
      repeat.updateBindings(view);
    }
    // add new views
    for (let i = viewsLength; i < itemsLength; i++) {
      let overrideContext = createFullOverrideContext(repeat, items[i], i, itemsLength);
      repeat.addView(overrideContext.bindingContext, overrideContext);
    }
  }

  /**
  * Handle the repeat's collection instance mutating.
  * @param repeat The repeat instance.
  * @param array The modified array.
  * @param splices Records of array changes.
  */
  instanceMutated(repeat, array, splices) {
    if (repeat.__queuedSplices) {
      for (let i = 0, ii = splices.length; i < ii; ++i) {
        let {index, removed, addedCount} = splices[i];
        mergeSplice(repeat.__queuedSplices, index, removed, addedCount);
      }
      // Array.prototype.slice is used here to clone the array
      repeat.__array = array.slice(0);
      return;
    }

    // Array.prototype.slice is used here to clone the array
    let maybePromise = this._runSplices(repeat, array.slice(0), splices);
    if (maybePromise instanceof Promise) {
      let queuedSplices = repeat.__queuedSplices = [];

      let runQueuedSplices = () => {
        if (!queuedSplices.length) {
          repeat.__queuedSplices = undefined;
          repeat.__array = undefined;
          return;
        }

        let nextPromise = this._runSplices(repeat, repeat.__array, queuedSplices) || Promise.resolve();
        queuedSplices = repeat.__queuedSplices = [];
        nextPromise.then(runQueuedSplices);
      };

      maybePromise.then(runQueuedSplices);
    }
  }

  /**
  * Run a normalised set of splices against the viewSlot children.
  * @param repeat The repeat instance.
  * @param array The modified array.
  * @param splices Records of array changes.
  * @return {Promise|undefined} A promise if animations have to be run.
  * @pre The splices must be normalised so as:
  *  * Any item added may not be later removed.
  *  * Removals are ordered by asending index
  */
  _runSplices(repeat, array, splices) {
    let removeDelta = 0;
    let rmPromises = [];

    for (let i = 0, ii = splices.length; i < ii; ++i) {
      let splice = splices[i];
      let removed = splice.removed;

      for (let j = 0, jj = removed.length; j < jj; ++j) {
        // the rmPromises.length correction works due to the ordered removal precondition
        let viewOrPromise = repeat.removeView(splice.index + removeDelta + rmPromises.length, true);
        if (viewOrPromise instanceof Promise) {
          rmPromises.push(viewOrPromise);
        }
      }
      removeDelta -= splice.addedCount;
    }

    if (rmPromises.length > 0) {
      return Promise.all(rmPromises).then(() => {
        let spliceIndexLow = this._handleAddedSplices(repeat, array, splices);
        updateOverrideContexts(repeat.views(), spliceIndexLow);
      });
    }

    let spliceIndexLow = this._handleAddedSplices(repeat, array, splices);
    updateOverrideContexts(repeat.views(), spliceIndexLow);

    return undefined;
  }

  _handleAddedSplices(repeat, array, splices) {
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
        let overrideContext = createFullOverrideContext(repeat, array[addIndex], addIndex, arrayLength);
        repeat.insertView(addIndex, overrideContext.bindingContext, overrideContext);
      }
    }

    return spliceIndexLow;
  }
}

/**
* A strategy for repeating a template over a Map.
*/
export class MapRepeatStrategy {
  /**
  * Gets a Map observer.
  * @param items The items to be observed.
  */
  getCollectionObserver(observerLocator, items) {
    return observerLocator.getMapObserver(items);
  }

  /**
  * Process the provided Map entries.
  * @param items The entries to process.
  */
  instanceChanged(repeat, items) {
    let removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
    if (removePromise instanceof Promise) {
      removePromise.then(() => this._standardProcessItems(repeat, items));
      return;
    }
    this._standardProcessItems(repeat, items);
  }

  _standardProcessItems(repeat, items) {
    let index = 0;
    let overrideContext;

    items.forEach((value, key) => {
      overrideContext = createFullOverrideContext(repeat, value, index, items.size, key);
      repeat.addView(overrideContext.bindingContext, overrideContext);
      ++index;
    });
  }

  /**
  * Handle changes in a Map collection.
  * @param map The underlying Map collection.
  * @param records The change records.
  */
  instanceMutated(repeat, map, records) {
    let key;
    let i;
    let ii;
    let overrideContext;
    let removeIndex;
    let addIndex;
    let record;
    let rmPromises = [];
    let viewOrPromise;

    for (i = 0, ii = records.length; i < ii; ++i) {
      record = records[i];
      key = record.key;
      switch (record.type) {
      case 'update':
        removeIndex = this._getViewIndexByKey(repeat, key);
        viewOrPromise = repeat.removeView(removeIndex, true, !repeat.viewsRequireLifecycle);
        if (viewOrPromise instanceof Promise) {
          rmPromises.push(viewOrPromise);
        }
        overrideContext = createFullOverrideContext(repeat, map.get(key), removeIndex, map.size, key);
        repeat.insertView(removeIndex, overrideContext.bindingContext, overrideContext);
        break;
      case 'add':
        addIndex = repeat.viewCount() <= map.size - 1 ? repeat.viewCount() : map.size - 1;
        overrideContext = createFullOverrideContext(repeat, map.get(key), addIndex, map.size, key);
        repeat.insertView(map.size - 1, overrideContext.bindingContext, overrideContext);
        break;
      case 'delete':
        if (record.oldValue === undefined) { return; }
        removeIndex = this._getViewIndexByKey(repeat, key);
        viewOrPromise = repeat.removeView(removeIndex, true, !repeat.viewsRequireLifecycle);
        if (viewOrPromise instanceof Promise) {
          rmPromises.push(viewOrPromise);
        }
        break;
      case 'clear':
        repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
        break;
      default:
        continue;
      }
    }

    if (rmPromises.length > 0) {
      Promise.all(rmPromises).then(() => {
        updateOverrideContexts(repeat.views(), 0);
      });
    } else {
      updateOverrideContexts(repeat.views(), 0);
    }
  }

  _getViewIndexByKey(repeat, key) {
    let i;
    let ii;
    let child;

    for (i = 0, ii = repeat.viewCount(); i < ii; ++i) {
      child = repeat.view(i);
      if (child.bindingContext[repeat.key] === key) {
        return i;
      }
    }

    return undefined;
  }
}

/**
* A strategy for repeating a template over a number.
*/
export class NumberRepeatStrategy {
  /**
  * Return the strategies collection observer. In this case none.
  */
  getCollectionObserver() {
    return null;
  }

  /**
  * Process the provided Number.
  * @param value The Number of how many time to iterate.
  */
  instanceChanged(repeat, value) {
    let removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
    if (removePromise instanceof Promise) {
      removePromise.then(() => this._standardProcessItems(repeat, value));
      return;
    }
    this._standardProcessItems(repeat, value);
  }

  _standardProcessItems(repeat, value) {
    let childrenLength = repeat.viewCount();
    let i;
    let ii;
    let overrideContext;
    let viewsToRemove;

    value = Math.floor(value);
    viewsToRemove = childrenLength - value;

    if (viewsToRemove > 0) {
      if (viewsToRemove > childrenLength) {
        viewsToRemove = childrenLength;
      }

      for (i = 0, ii = viewsToRemove; i < ii; ++i) {
        repeat.removeView(childrenLength - (i + 1), true, !repeat.viewsRequireLifecycle);
      }

      return;
    }

    for (i = childrenLength, ii = value; i < ii; ++i) {
      overrideContext = createFullOverrideContext(repeat, i, i, ii);
      repeat.addView(overrideContext.bindingContext, overrideContext);
    }

    updateOverrideContexts(repeat.views(), 0);
  }
}

/**
* A strategy for repeating a template over a Set.
*/
export class SetRepeatStrategy {
  /**
  * Gets a Set observer.
  * @param items The items to be observed.
  */
  getCollectionObserver(observerLocator, items) {
    return observerLocator.getSetObserver(items);
  }

  /**
  * Process the provided Set entries.
  * @param items The entries to process.
  */
  instanceChanged(repeat, items) {
    let removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
    if (removePromise instanceof Promise) {
      removePromise.then(() => this._standardProcessItems(repeat, items));
      return;
    }
    this._standardProcessItems(repeat, items);
  }

  _standardProcessItems(repeat, items) {
    let index = 0;
    let overrideContext;

    items.forEach(value => {
      overrideContext = createFullOverrideContext(repeat, value, index, items.size);
      repeat.addView(overrideContext.bindingContext, overrideContext);
      ++index;
    });
  }

  /**
  * Handle changes in a Set collection.
  * @param repeat The repeat instance.
  * @param set The underlying Set collection.
  * @param records The change records.
  */
  instanceMutated(repeat, set, records) {
    let value;
    let i;
    let ii;
    let overrideContext;
    let removeIndex;
    let record;
    let rmPromises = [];
    let viewOrPromise;

    for (i = 0, ii = records.length; i < ii; ++i) {
      record = records[i];
      value = record.value;
      switch (record.type) {
      case 'add':
        let size = Math.max(set.size - 1, 0);
        overrideContext = createFullOverrideContext(repeat, value, size, set.size);
        repeat.insertView(size, overrideContext.bindingContext, overrideContext);
        break;
      case 'delete':
        removeIndex = this._getViewIndexByValue(repeat, value);
        viewOrPromise = repeat.removeView(removeIndex, true, !repeat.viewsRequireLifecycle);
        if (viewOrPromise instanceof Promise) {
          rmPromises.push(viewOrPromise);
        }
        break;
      case 'clear':
        repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
        break;
      default:
        continue;
      }
    }

    if (rmPromises.length > 0) {
      Promise.all(rmPromises).then(() => {
        updateOverrideContexts(repeat.views(), 0);
      });
    } else {
      updateOverrideContexts(repeat.views(), 0);
    }
  }

  _getViewIndexByValue(repeat, value) {
    let i;
    let ii;
    let child;

    for (i = 0, ii = repeat.viewCount(); i < ii; ++i) {
      child = repeat.view(i);
      if (child.bindingContext[repeat.local] === value) {
        return i;
      }
    }

    return undefined;
  }
}

@customAttribute('else')
@templateController
@inject(BoundViewFactory, ViewSlot)
export class Else extends IfCore {
  constructor(viewFactory, viewSlot) {
    super(viewFactory, viewSlot);
    this._registerInIf();
  }

  bind(bindingContext, overrideContext) {
    super.bind(bindingContext, overrideContext);
    // Render on initial
    if (this.ifVm.condition) {
      this._hide();
    } else {
      this._show();
    }
  }

  _registerInIf() {
    // We support the pattern <div if.bind="x"></div><div else></div>.
    // Obvisouly between the two, we must accepts text (spaces) and comments.
    // The `if` node is expected to be a comment anchor, because of `@templateController`.
    // To simplify the code we basically walk up to the first Aurelia predecessor,
    // so having static tags in between (no binding) would work but is not intended to be supported.
    let previous = this.viewSlot.anchor.previousSibling;
    while (previous && !previous.au) {
      previous = previous.previousSibling;
    }
    if (!previous || !previous.au.if) {
      throw new Error("Can't find matching If for Else custom attribute.");
    }
    this.ifVm = previous.au.if.viewModel;
    this.ifVm.elseVm = this;
  }
}

/**
* Binding to conditionally include or not include template logic depending on returned result
* - value should be Boolean or will be treated as such (truthy / falsey)
*/
@customAttribute('if')
@templateController
@inject(BoundViewFactory, ViewSlot)
export class If extends IfCore {
  @bindable({ primaryProperty: true }) condition: any;
  @bindable swapOrder: "before"|"with"|"after";
  @bindable cache: boolean|string = true;

  /**
  * Binds the if to the binding context and override context
  * @param bindingContext The binding context
  * @param overrideContext An override context for binding.
  */
  bind(bindingContext, overrideContext) {
    super.bind(bindingContext, overrideContext);
    if (this.condition) {
      this._show();
    } else {
      this._hide();
    }
  }

  /**
  * Invoked everytime value property changes.
  * @param newValue The new value
  */
  conditionChanged(newValue) {
    this._update(newValue);
  }

  _update(show) {
    if (this.animating) {
      return;
    }

    let promise;
    if (this.elseVm) {
      promise = show ? this._swap(this.elseVm, this) : this._swap(this, this.elseVm);
    } else {
      promise = show ? this._show() : this._hide();
    }

    if (promise) {
      this.animating = true;
      promise.then(() => {
        this.animating = false;
        if (this.condition !== this.showing) {
          this._update(this.condition);
        }
      });
    }
  }

  _swap(remove, add) {
    switch (this.swapOrder) {
    case 'before':
      return Promise.resolve(add._show()).then(() => remove._hide());
    case 'with':
      return Promise.all([ remove._hide(), add._show() ]);
    default:  // "after", default and unknown values
      let promise = remove._hide();
      return promise ? promise.then(() => add._show()) : add._show();
    }
  }
}

/**
* Simple html sanitization converter to preserve whitelisted elements and attributes on a bound property containing html.
*/
@valueConverter('sanitizeHTML')
@inject(HTMLSanitizer)
export class SanitizeHTMLValueConverter {
  /**
   * Creates an instanse of the value converter.
   * @param sanitizer The html sanitizer.
   */
  constructor(sanitizer) {
    this.sanitizer = sanitizer;
  }

  /**
  * Process the provided markup that flows to the view.
  * @param untrustedMarkup The untrusted markup to be sanitized.
  */
  toView(untrustedMarkup) {
    if (untrustedMarkup === null || untrustedMarkup === undefined) {
      return null;
    }

    return this.sanitizer.sanitize(untrustedMarkup);
  }
}

export function getElementName(address) {
  return /([^\/^\?]+)\.html/i.exec(address)[1].toLowerCase();
}

export function configure(config) {
  let viewEngine = config.container.get(ViewEngine);
  let loader = config.aurelia.loader;

  viewEngine.addResourcePlugin('.html', {
    'fetch': function(address) {
      return loader.loadTemplate(address).then(registryEntry => {
        let bindable = registryEntry.template.getAttribute('bindable');
        let elementName = getElementName(address);

        if (bindable) {
          bindable = bindable.split(',').map(x => x.trim());
          registryEntry.template.removeAttribute('bindable');
        } else {
          bindable = [];
        }

        return { [elementName]: _createDynamicElement(elementName, address, bindable) };
      });
    }
  });
}

@bindingBehavior('signal')
export class SignalBindingBehavior {
  static inject() { return [BindingSignaler]; }
  signals;

  constructor(bindingSignaler) {
    this.signals = bindingSignaler.signals;
  }

  bind(binding, source) {
    if (!binding.updateTarget) {
      throw new Error('Only property bindings and string interpolation bindings can be signaled.  Trigger, delegate and call bindings cannot be signaled.');
    }
    if (arguments.length === 3) {
      let name = arguments[2];
      let bindings = this.signals[name] || (this.signals[name] = []);
      bindings.push(binding);
      binding.signalName = name;
    } else if (arguments.length > 3) {
      let names = Array.prototype.slice.call(arguments, 2);
      let i = names.length;
      while (i--) {
        let name = names[i];
        let bindings = this.signals[name] || (this.signals[name] = []);
        bindings.push(binding);
      }
      binding.signalName = names;
    } else {
      throw new Error('Signal name is required.');
    }
  }

  unbind(binding, source) {
    let name = binding.signalName;
    binding.signalName = null;
    if (Array.isArray(name)) {
      let names = name;
      let i = names.length;
      while (i--) {
        let n = names[i];
        let bindings = this.signals[n];
        bindings.splice(bindings.indexOf(binding), 1);
      }
    } else {
      let bindings = this.signals[name];
      bindings.splice(bindings.indexOf(binding), 1);
    }
  }
}

/**
* Binding to conditionally show markup in the DOM based on the value.
* - different from "if" in that the markup is still added to the DOM, simply not shown.
*/
@customAttribute('hide')
export class Hide {

  static inject() {
    return [DOM.Element, Animator, Optional.of(DOM.boundary, true)];
  }

  /**
  * Creates a new instance of Hide.
  * @param element Target element to conditionally hide.
  * @param animator The animator that conditionally adds or removes the aurelia-hide css class.
  * @param domBoundary The DOM boundary. Used when the behavior appears within a component that utilizes the shadow DOM.
  */
  constructor(element, animator, domBoundary) {
    this.element = element;
    this.animator = animator;
    this.domBoundary = domBoundary;
  }

  /**
  * Invoked when the behavior is created.
  */
  created() {
    injectAureliaHideStyleAtBoundary(this.domBoundary);
  }

  /**
  * Invoked everytime the bound value changes.
  * @param newValue The new value.
  */
  valueChanged(newValue) {
    if (newValue) {
      this.animator.addClass(this.element, aureliaHideClassName);
    } else {
      this.animator.removeClass(this.element, aureliaHideClassName);
    }
  }

  /**
  * Binds the Hide attribute.
  */
  bind(bindingContext) {
    this.valueChanged(this.value);
  }
}

/**
* Binding to conditionally show markup in the DOM based on the value.
* - different from "if" in that the markup is still added to the DOM, simply not shown.
*/
@customAttribute('show')
export class Show {

  static inject() {
    return [DOM.Element, Animator, Optional.of(DOM.boundary, true)];
  }

  /**
  * Creates a new instance of Show.
  * @param element Target element to conditionally show.
  * @param animator The animator that conditionally adds or removes the aurelia-hide css class.
  * @param domBoundary The DOM boundary. Used when the behavior appears within a component that utilizes the shadow DOM.
  */
  constructor(element, animator, domBoundary) {
    this.element = element;
    this.animator = animator;
    this.domBoundary = domBoundary;
  }

  /**
  * Invoked when the behavior is created.
  */
  created() {
    injectAureliaHideStyleAtBoundary(this.domBoundary);
  }

  /**
  * Invoked everytime the bound value changes.
  * @param newValue The new value.
  */
  valueChanged(newValue) {
    if (newValue) {
      this.animator.removeClass(this.element, aureliaHideClassName);
    } else {
      this.animator.addClass(this.element, aureliaHideClassName);
    }
  }

  /**
  * Binds the Show attribute.
  */
  bind(bindingContext) {
    this.valueChanged(this.value);
  }
}

/**
* A strategy is for repeating a template over an iterable or iterable-like object.
*/
interface RepeatStrategy {
  instanceChanged(repeat: Repeat, items: any): void;
  instanceMutated(repeat: Repeat, items: any, changes: any): void;
  getCollectionObserver(observerLocator: any, items: any): any;
}

/**
* Locates the best strategy to best repeating a template over different types of collections.
* Custom strategies can be plugged in as well.
*/
export class RepeatStrategyLocator {
  /**
  * Creates a new RepeatStrategyLocator.
  */
  constructor() {
    this.matchers = [];
    this.strategies = [];

    this.addStrategy(items => items === null || items === undefined, new NullRepeatStrategy());
    this.addStrategy(items => items instanceof Array, new ArrayRepeatStrategy());
    this.addStrategy(items => items instanceof Map, new MapRepeatStrategy());
    this.addStrategy(items => items instanceof Set, new SetRepeatStrategy());
    this.addStrategy(items => typeof items === 'number', new NumberRepeatStrategy());
  }

  /**
  * Adds a repeat strategy to be located when repeating a template over different collection types.
  * @param strategy A repeat strategy that can iterate a specific collection type.
  */
  addStrategy(matcher: (items: any) => boolean, strategy: RepeatStrategy) {
    this.matchers.push(matcher);
    this.strategies.push(strategy);
  }

  /**
  * Gets the best strategy to handle iteration.
  */
  getStrategy(items: any): RepeatStrategy {
    let matchers = this.matchers;

    for (let i = 0, ii = matchers.length; i < ii; ++i) {
      if (matchers[i](items)) {
        return this.strategies[i];
      }
    }

    return null;
  }
}

/*eslint no-loop-func:0, no-unused-vars:0*/
/**
* Binding to iterate over iterable objects (Array, Map and Number) to genereate a template for each iteration.
*/
@customAttribute('repeat')
@templateController
@inject(BoundViewFactory, TargetInstruction, ViewSlot, ViewResources, ObserverLocator, RepeatStrategyLocator)
export class Repeat extends AbstractRepeater {
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
    this.matcherBinding = this._captureAndRemoveMatcherBinding();
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

  _observeCollection() {
    let items = this.items;
    this.collectionObserver = this.strategy.getCollectionObserver(this.observerLocator, items);
    if (this.collectionObserver) {
      this.callContext = 'handleCollectionMutated';
      this.collectionObserver.subscribe(this.callContext, this);
    }
  }

  _captureAndRemoveMatcherBinding() {
    if (this.viewFactory.viewFactory) {
      const instructions = this.viewFactory.viewFactory.instructions;
      const instructionIds = Object.keys(instructions);
      for (let i = 0; i < instructionIds.length; i++) {
        const expressions = instructions[instructionIds[i]].expressions;
        if (expressions) {
          for (let ii = 0; i < expressions.length; i++) {
            if (expressions[ii].targetProperty === 'matcher') {
              const matcherBinding = expressions[ii];
              expressions.splice(ii, 1);
              return matcherBinding;
            }
          }
        }
      }
    }

    return undefined;
  }

  // @override AbstractRepeater
  viewCount() { return this.viewSlot.children.length; }
  views() { return this.viewSlot.children; }
  view(index) { return this.viewSlot.children[index]; }
  matcher() { return this.matcherBinding ? this.matcherBinding.sourceExpression.evaluate(this.scope, this.matcherBinding.lookupFunctions) : null; }

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
    let j = view.bindings.length;
    while (j--) {
      updateOneTimeBinding(view.bindings[j]);
    }
    j = view.controllers.length;
    while (j--) {
      let k = view.controllers[j].boundProperties.length;
      while (k--) {
        let binding = view.controllers[j].boundProperties[k].binding;
        updateOneTimeBinding(binding);
      }
    }
  }
}
