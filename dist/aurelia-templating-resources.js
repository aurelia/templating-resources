import * as LogManager from 'aurelia-logging';
import {bindingMode,EventManager,sourceContext,createOverrideContext,valueConverter,ObserverLocator,getChangeRecords,BindingBehavior,ValueConverter} from 'aurelia-binding';
import {ViewResources,resource,ViewCompileInstruction,useView,customElement,bindable,customAttribute,TargetInstruction,BoundViewFactory,ViewSlot,templateController,Animator,CompositionEngine,noView,ViewEngine} from 'aurelia-templating';
import {Loader} from 'aurelia-loader';
import {Container,inject,transient} from 'aurelia-dependency-injection';
import {relativeToFile} from 'aurelia-path';
import {DOM,FEATURE} from 'aurelia-pal';
import {TaskQueue} from 'aurelia-task-queue';

const eventNamesRequired = `The updateTrigger binding behavior requires at least one event name argument: eg <input value.bind="firstName & updateTrigger:'blur'">`;
const notApplicableMessage = `The updateTrigger binding behavior can only be applied to two-way bindings on input/select elements.`;

export class UpdateTriggerBindingBehavior {
  static inject = [EventManager];

  constructor(eventManager) {
    this.eventManager = eventManager;
  }

  bind(binding, source, ...events) {
    if (events.length === 0) {
      throw new Error(eventNamesRequired);
    }
    if (binding.mode !== bindingMode.twoWay || !binding.targetProperty.handler) {
      throw new Error(notApplicableMessage);
    }

    // stash the original element subscribe function.
    binding.targetProperty.originalHandler = binding.targetProperty.handler;

    // replace the element subscribe function with one that uses the correct events.
    let handler = this.eventManager.createElementHandler(events);
    binding.targetProperty.handler = handler;
  }

  unbind(binding, source) {
    // restore the state of the binding.
    binding.targetProperty.handler = binding.targetProperty.originalHandler;
    binding.targetProperty.originalHandler = null;
  }
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

function debounce(newValue) {
  let state = this.debounceState;
  if (state.immediate) {
    state.immediate = false;
    this.debouncedMethod(newValue);
    return;
  }
  clearTimeout(state.timeoutId);
  state.timeoutId = setTimeout(
    () => this.debouncedMethod(newValue),
    state.delay);
}

export class DebounceBindingBehavior {
  bind(binding, source, delay = 200) {
    // determine which method to debounce.
    let methodToDebounce = 'updateTarget'; // one-way bindings or interpolation bindings
    if (binding.callSource) {
      methodToDebounce = 'callSource';     // listener and call bindings
    } else if (binding.updateSource && binding.mode === bindingMode.twoWay) {
      methodToDebounce = 'updateSource';   // two-way bindings
    }

    // stash the original method and it's name.
    // note: a generic name like "originalMethod" is not used to avoid collisions
    // with other binding behavior types.
    binding.debouncedMethod = binding[methodToDebounce];
    binding.debouncedMethod.originalName = methodToDebounce;

    // replace the original method with the debouncing version.
    binding[methodToDebounce] = debounce;

    // create the debounce state.
    binding.debounceState = {
      delay: delay,
      timeoutId: null,
      immediate: methodToDebounce === 'updateTarget' // should not delay initial target update that occurs during bind.
    };
  }

  unbind(binding, source) {
    // restore the state of the binding.
    let methodToRestore = binding.debouncedMethod.originalName;
    binding[methodToRestore] = binding.debouncedMethod;
    binding.debouncedMethod = null;
    clearTimeout(binding.debounceState.timeoutId);
    binding.debounceState = null;
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

class ModeBindingBehavior {
  constructor(mode) {
    this.mode = mode;
  }

  bind(binding, source, lookupFunctions) {
    binding.originalMode = binding.mode;
    binding.mode = this.mode;
  }

  unbind(binding, source) {
    binding.mode = binding.originalMode;
    binding.originalMode = null;
  }
}

export class OneTimeBindingBehavior extends ModeBindingBehavior {
  constructor() {
    super(bindingMode.oneTime);
  }
}

export class OneWayBindingBehavior extends ModeBindingBehavior {
  constructor() {
    super(bindingMode.oneWay);
  }
}

export class TwoWayBindingBehavior extends ModeBindingBehavior {
  constructor() {
    super(bindingMode.twoWay);
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

/*eslint new-cap:0, padded-blocks:0*/
let cssUrlMatcher = /url\((?!['"]data)([^)]+)\)/gi;

function fixupCSSUrls(address, css) {
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
    this._global = null;
    this._scoped = null;
  }

  initialize(container: Container, target: Function): void {
    this._global = new target('global');
    this._scoped = new target('scoped');
  }

  register(registry: ViewResources, name?: string): void {
    registry.registerViewEngineHooks(name === 'scoped' ? this._scoped : this._global);
  }

  load(container: Container): Promise<CSSResource> {
    return container.get(Loader).loadText(this.address).then(text => {
      text = fixupCSSUrls(this.address, text);
      this._global.css = text;
      this._scoped.css = text;
    });
  }
}

class CSSViewEngineHooks {
  constructor(mode: string) {
    this.mode = mode;
    this.css = null;
    this._alreadyGloballyInjected = false;
  }

  beforeCompile(content: DocumentFragment, resources: ViewResources, instruction: ViewCompileInstruction): void {
    if (this.mode === 'scoped') {
      if (instruction.targetShadowDOM) {
        DOM.injectStyles(this.css, content, true);
      } else if (FEATURE.scopedCSS) {
        let styleNode = DOM.injectStyles(this.css, content, true);
        styleNode.setAttribute('scoped', 'scoped');
      } else if (!this._alreadyGloballyInjected) {
        DOM.injectStyles(this.css);
        this._alreadyGloballyInjected = true;
      }
    } else if (!this._alreadyGloballyInjected) {
      DOM.injectStyles(this.css);
      this._alreadyGloballyInjected = true;
    }
  }
}

export function _createCSSResource(address: string): Function {
  @resource(new CSSResource(address))
  class ViewCSS extends CSSViewEngineHooks {}
  return ViewCSS;
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

/**
* Attribute to be placed on any HTML element in a view to emit the View instance
* to the debug console, giving you insight into the live View instance, including
* all child views, live bindings, behaviors and more.
*/
@customAttribute('view-spy')
export class ViewSpy {
  /**
  * Creates a new instance of ViewSpy.
  */
  constructor() {
    this.logger = LogManager.getLogger('view-spy');
  }

  _log(lifecycleName, context) {
    if (!this.value && lifecycleName === 'created' ) {
      this.logger.info(lifecycleName, this.view);
    } else if (this.value && this.value.indexOf(lifecycleName) !== -1) {
      this.logger.info(lifecycleName, this.view, context);
    }
  }

  /**
  * Invoked when the target view is created.
  * @param view The target view.
  */
  created(view) {
    this.view = view;
    this._log('created');
  }

  /**
  * Invoked when the target view is bound.
  * @param bindingContext The target view's binding context.
  */
  bind(bindingContext) {
    this._log('bind', bindingContext);
  }

  /**
  * Invoked when the target element is attached to the DOM.
  */
  attached() {
    this._log('attached');
  }

  /**
  * Invoked when the target element is detached from the DOM.
  */
  detached() {
    this._log('detached');
  }

  /**
  * Invoked when the target element is unbound.
  */
  unbind() {
    this._log('unbind');
  }
}

/**
* Attribute to be placed on any element to have it emit the View Compiler's
* TargetInstruction into the debug console, giving you insight into all the
* parsed bindings, behaviors and event handers for the targeted element.
*/
@customAttribute('compile-spy')
@inject(DOM.Element, TargetInstruction)
export class CompileSpy {
  /**
  * Creates and instanse of CompileSpy.
  * @param element target element on where attribute is placed on.
  * @param instruction instructions for how the target element should be enhanced.
  */
  constructor(element, instruction) {
    LogManager.getLogger('compile-spy').info(element, instruction);
  }
}

/**
* CustomAttribute that binds provided DOM element's focus attribute with a property on the viewmodel.
*/
@customAttribute('focus', bindingMode.twoWay)
@inject(DOM.Element, TaskQueue)
export class Focus {
  /**
  * Creates an instance of Focus.
  * @paramelement Target element on where attribute is placed on.
  * @param taskQueue The TaskQueue instance.
  */
  constructor(element, taskQueue) {
    this.element = element;
    this.taskQueue = taskQueue;

    this.focusListener = e => {
      this.value = true;
    };
    this.blurListener = e => {
      if (DOM.activeElement !== this.element) {
        this.value = false;
      }
    };
  }

  /**
  * Invoked everytime the bound value changes.
  * @param newValue The new value.
  */
  valueChanged(newValue) {
    if (newValue) {
      this._giveFocus();
    } else {
      this.element.blur();
    }
  }

  _giveFocus() {
    this.taskQueue.queueMicroTask(() => {
      if (this.value) {
        this.element.focus();
      }
    });
  }

  /**
  * Invoked when the attribute is attached to the DOM.
  */
  attached() {
    this.element.addEventListener('focus', this.focusListener);
    this.element.addEventListener('blur', this.blurListener);
  }

  /**
  * Invoked when the attribute is detached from the DOM.
  */
  detached() {
    this.element.removeEventListener('focus', this.focusListener);
    this.element.removeEventListener('blur', this.blurListener);
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
    this.viewFactory = viewFactory;
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

/**
* Binding to conditionally show markup in the DOM based on the value.
* - different from "if" in that the markup is still added to the DOM, simply not shown.
*/
@customAttribute('show')
@inject(DOM.Element, Animator)
export class Show {
  /**
  * Creates a new instance of Show.
  * @param element Target element to conditionally show.
  * @param animator The animator that conditionally adds or removes the aurelia-hide css class.
  */
  constructor(element, animator) {
    this.element = element;
    this.animator = animator;
  }

  /**
  * Invoked everytime the bound value changes.
  * @param newValue The new value.
  */
  valueChanged(newValue) {
    if (newValue) {
      this.animator.removeClass(this.element, 'aurelia-hide');
    } else {
      this.animator.addClass(this.element, 'aurelia-hide');
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

/**
* Binding to conditionally include or not include template logic depending on returned result
* - value should be Boolean or will be treated as such (truthy / falsey)
*/
@customAttribute('if')
@templateController
@inject(BoundViewFactory, ViewSlot, TaskQueue)
export class If {
  /**
  * Creates an instance of If.
  * @param {BoundViewFactory} viewFactory The factory generating the view
  * @param {ViewSlot} viewSlot The slot the view is injected in to
  * @param {TaskQueue} taskQueue
  */
  constructor(viewFactory, viewSlot, taskQueue) {
    this.viewFactory = viewFactory;
    this.viewSlot = viewSlot;
    this.showing = false;
    this.taskQueue = taskQueue;
    this.view = null;
    this.bindingContext = null;
    this.overrideContext = null;
  }

  /**
  * Binds the if to the binding context and override context
  * @param bindingContext The binding context
  * @param overrideContext An override context for binding.
  */
  bind(bindingContext, overrideContext) {
    // Store parent bindingContext, so we can pass it down
    this.bindingContext = bindingContext;
    this.overrideContext = overrideContext;
    this.valueChanged(this.value);
  }

  /**
  * Invoked everytime value property changes.
  * @param newValue The new value
  */
  valueChanged(newValue) {
    if (!newValue) {
      if (this.view !== null && this.showing) {
        this.taskQueue.queueMicroTask(() => {
          let viewOrPromise = this.viewSlot.remove(this.view);
          if (viewOrPromise instanceof Promise) {
            viewOrPromise.then(() => this.view.unbind());
          } else {
            this.view.unbind();
          }
        });
      }

      this.showing = false;
      return;
    }

    if (this.view === null) {
      this.view = this.viewFactory.create();
    }

    if (!this.view.isBound) {
      this.view.bind(this.bindingContext, this.overrideContext);
    }

    if (!this.showing) {
      this.showing = true;
      this.viewSlot.add(this.view);
    }
  }

  /**
  * Unbinds the if
  */
  unbind() {
    if (this.view === null) {
      return;
    }

    this.view.unbind();

    if (!this.viewFactory.isCaching) {
      return;
    }

    if (this.showing) {
      this.showing = false;
      this.viewSlot.remove(this.view, true, true);
    }
    this.view.returnToCache();
    this.view = null;
  }
}

/**
* Used to compose a new view / view-model template or bind to an existing instance.
*/
@customElement('compose')
@noView
@inject(DOM.Element, Container, CompositionEngine, ViewSlot, ViewResources, TaskQueue)
export class Compose {
  /**
  * Model to bind the custom element to.
  *
  * @property model
  * @type {CustomElement}
  */
  @bindable model
  /**
  * View to bind the custom element to.
  *
  * @property view
  * @type {HtmlElement}
  */
  @bindable view
  /**
  * View-model to bind the custom element's template to.
  *
  * @property viewModel
  * @type {Class}
  */
  @bindable viewModel

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
  }

  /**
  * Used to set the bindingContext.
  *
  * @param {bindingContext} bindingContext The context in which the view model is executed in.
  * @param {overrideContext} overrideContext The context in which the view model is executed in.
  */
  bind(bindingContext, overrideContext) {
    this.bindingContext = bindingContext;
    this.overrideContext = overrideContext;
    processInstruction(this, createInstruction(this, {
      view: this.view,
      viewModel: this.viewModel,
      model: this.model
    }));
  }

  /**
  * Unbinds the Compose.
  */
  unbind(bindingContext, overrideContext) {
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
    if (this.currentInstruction) {
      this.currentInstruction.model = newValue;
      return;
    }

    this.taskQueue.queueMicroTask(() => {
      if (this.currentInstruction) {
        this.currentInstruction.model = newValue;
        return;
      }

      let vm = this.currentViewModel;

      if (vm && typeof vm.activate === 'function') {
        vm.activate(newValue);
      }
    });
  }

  /**
  * Invoked everytime the bound view changes.
  * @param newValue The new value.
  * @param oldValue The old value.
  */
  viewChanged(newValue, oldValue) {
    let instruction = createInstruction(this, {
      view: newValue,
      viewModel: this.currentViewModel || this.viewModel,
      model: this.model
    });

    if (this.currentInstruction) {
      this.currentInstruction = instruction;
      return;
    }

    this.currentInstruction = instruction;
    this.taskQueue.queueMicroTask(() => processInstruction(this, this.currentInstruction));
  }

  /**
    * Invoked everytime the bound view model changes.
    * @param newValue The new value.
    * @param oldValue The old value.
    */
  viewModelChanged(newValue, oldValue) {
    let instruction = createInstruction(this, {
      viewModel: newValue,
      view: this.view,
      model: this.model
    });

    if (this.currentInstruction) {
      this.currentInstruction = instruction;
      return;
    }

    this.currentInstruction = instruction;
    this.taskQueue.queueMicroTask(() => processInstruction(this, this.currentInstruction));
  }
}

function createInstruction(composer, instruction) {
  return Object.assign(instruction, {
    bindingContext: composer.bindingContext,
    overrideContext: composer.overrideContext,
    container: composer.container,
    viewSlot: composer.viewSlot,
    viewResources: composer.viewResources,
    currentController: composer.currentController,
    host: composer.element
  });
}

function processInstruction(composer, instruction) {
  composer.currentInstruction = null;
  composer.compositionEngine.compose(instruction).then(controller => {
    composer.currentController = controller;
    composer.currentViewModel = controller ? controller.viewModel : null;
  });
}

/**
* Base class that defines common properties and methods for a collection strategy implementation.
*/
@transient()
export class CollectionStrategy {
  /**
  * Initializes the strategy collection.
  * @param repeat The repeat instance.
  * @param bindingContext The binding context.
  * @param overrideContext The override context.
  */
  initialize(repeat, bindingContext, overrideContext) {
    this.viewFactory = repeat.viewFactory;
    this.viewSlot = repeat.viewSlot;
    this.items = repeat.items;
    this.local = repeat.local;
    this.key = repeat.key;
    this.value = repeat.value;
    this.bindingContext = bindingContext;
    this.overrideContext = overrideContext;
  }

  /**
  * Disposes the collection strategy.
  */
  dispose() {
    this.viewFactory = null;
    this.viewSlot = null;
    this.items = null;
    this.local = null;
    this.key = null;
    this.value = null;
    this.bindingContext = null;
    this.overrideContext = null;
  }

  /**
  * Update the override context.
  * @param startIndex index in collection where to start updating.
  */
  updateOverrideContexts(startIndex) {
    let children = this.viewSlot.children;
    let length = children.length;

    if (startIndex > 0) {
      startIndex = startIndex - 1;
    }

    for (; startIndex < length; ++startIndex) {
      this.updateOverrideContext(children[startIndex].overrideContext, startIndex, length);
    }
  }

  /**
    * Creates a complete override context.
    * @param data The item's value.
    * @param index The item's index.
    * @param length The collections total length.
    * @param key The key in a key/value pair.
    */
  createFullOverrideContext(data, index, length, key) {
    let overrideContext = this.createBaseOverrideContext(data, key);
    this.updateOverrideContext(overrideContext, index, length);
    return overrideContext;
  }

  /**
  * Creates base of an override context.
  * @param data The item's value.
  * @param key The key in a key/value pair.
  */
  createBaseOverrideContext(data, key) {
    let bindingContext = {};
    let overrideContext = createOverrideContext(bindingContext, this.overrideContext);
    // is key/value pair (Map)
    if (typeof key !== 'undefined') {
      bindingContext[this.key] = key;
      bindingContext[this.value] = data;
    } else {
      bindingContext[this.local] = data;
    }

    return overrideContext;
  }

  /**
  * Updates the override context.
  * @param context The context to be updated.
  * @param index The context's index.
  * @param length The collection's length.
  */
  updateOverrideContext(overrideContext, index, length) {
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
}

export class SignalBindingBehavior {
  static inject() { return [BindingSignaler]; }
  signals;

  constructor(bindingSignaler) {
    this.signals = bindingSignaler.signals;
  }

  bind(binding, source, name) {
    if (!binding.updateTarget) {
      throw new Error('Only property bindings and string interpolation bindings can be signaled.  Trigger, delegate and call bindings cannot be signaled.');
    }
    if (binding.mode === bindingMode.oneTime) {
      throw new Error('One-time bindings cannot be signaled.');
    }
    let bindings = this.signals[name] || (this.signals[name] = []);
    bindings.push(binding);
    binding.signalName = name;
  }

  unbind(binding, source) {
    let name = binding.signalName;
    binding.signalName = null;
    let bindings = signals[name];
    bindings.splice(bindings.indexOf(binding), 1);
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

/**
* A strategy for iterating Arrays.
*/
@inject(ObserverLocator)
export class ArrayCollectionStrategy extends CollectionStrategy {
  /**
  * Creates an instance of ArrayCollectionStrategy.
  * @param observerLocator The instance of the observerLocator.
  */
  constructor(observerLocator) {
    super();
    this.observerLocator = observerLocator;
  }
  /**
  * Process the provided array items.
  * @param items The underlying array.
  */
  processItems(items) {
    let i;
    let ii;
    let overrideContext;
    let view;
    this.items = items;
    for (i = 0, ii = items.length; i < ii; ++i) {
      overrideContext = super.createFullOverrideContext(items[i], i, ii);
      view = this.viewFactory.create();
      view.bind(overrideContext.bindingContext, overrideContext);
      this.viewSlot.add(view);
    }
  }

  /**
  * Gets an Array observer.
  * @param items The items to be observed.
  */
  getCollectionObserver(items) {
    return this.observerLocator.getArrayObserver(items);
  }

  /**
  * Handles changes to the underlying array.
  * @param array The modified array.
  * @param splices Records of array changes.
  */
  handleChanges(array, splices) {
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
        let spliceIndexLow = this._handleAddedSplices(array, splices);
        this.updateOverrideContexts(spliceIndexLow);
      });
    } else {
      let spliceIndexLow = this._handleAddedSplices(array, splices);
      super.updateOverrideContexts(spliceIndexLow);
    }
  }

  _handleAddedSplices(array, splices) {
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
        let overrideContext = this.createFullOverrideContext(array[addIndex], addIndex, arrayLength);
        let view = this.viewFactory.create();
        view.bind(overrideContext.bindingContext, overrideContext);
        this.viewSlot.insert(addIndex, view);
      }
    }

    return spliceIndexLow;
  }
}

/**
* A strategy for iterating Map.
*/
@inject(ObserverLocator)
export class MapCollectionStrategy extends CollectionStrategy {
  /**
  * Creates an instance of MapCollectionStrategy.
  * @param observerLocator The instance of the observerLocator.
  */
  constructor(observerLocator) {
    super();
    this.observerLocator = observerLocator;
  }
  /**
  * Gets a Map observer.
  * @param items The items to be observed.
  */
  getCollectionObserver(items) {
    return this.observerLocator.getMapObserver(items);
  }

  /**
  * Process the provided Map entries.
  * @param items The entries to process.
  */
  processItems(items) {
    let viewFactory = this.viewFactory;
    let viewSlot = this.viewSlot;
    let index = 0;
    let overrideContext;
    let view;

    items.forEach((value, key) => {
      overrideContext = this.createFullOverrideContext(value, index, items.size, key);
      view = viewFactory.create();
      view.bind(overrideContext.bindingContext, overrideContext);
      viewSlot.add(view);
      ++index;
    });
  }

  /**
  * Handle changes in a Map collection.
  * @param map The underlying Map collection.
  * @param records The change records.
  */
  handleChanges(map, records) {
    let viewSlot = this.viewSlot;
    let key;
    let i;
    let ii;
    let view;
    let overrideContext;
    let removeIndex;
    let record;
    let rmPromises = [];
    let viewOrPromise;

    for (i = 0, ii = records.length; i < ii; ++i) {
      record = records[i];
      key = record.key;
      switch (record.type) {
      case 'update':
        removeIndex = this._getViewIndexByKey(key);
        viewOrPromise = viewSlot.removeAt(removeIndex, true);
        if (viewOrPromise instanceof Promise) {
          rmPromises.push(viewOrPromise);
        }
        overrideContext = this.createFullOverrideContext(map.get(key), removeIndex, map.size, key);
        view = this.viewFactory.create();
        view.bind(overrideContext.bindingContext, overrideContext);
        viewSlot.insert(removeIndex, view);
        break;
      case 'add':
        overrideContext = this.createFullOverrideContext(map.get(key), map.size - 1, map.size, key);
        view = this.viewFactory.create();
        view.bind(overrideContext.bindingContext, overrideContext);
        viewSlot.insert(map.size - 1, view);
        break;
      case 'delete':
        if (record.oldValue === undefined) { return; }
        removeIndex = this._getViewIndexByKey(key);
        viewOrPromise = viewSlot.removeAt(removeIndex, true);
        if (viewOrPromise instanceof Promise) {
          rmPromises.push(viewOrPromise);
        }
        break;
      case 'clear':
        viewSlot.removeAll(true);
        break;
      default:
        continue;
      }
    }

    if (rmPromises.length > 0) {
      Promise.all(rmPromises).then(() => {
        this.updateOverrideContexts(0);
      });
    } else {
      this.updateOverrideContexts(0);
    }
  }

  _getViewIndexByKey(key) {
    let viewSlot = this.viewSlot;
    let i;
    let ii;
    let child;

    for (i = 0, ii = viewSlot.children.length; i < ii; ++i) {
      child = viewSlot.children[i];
      if (child.overrideContext[this.key] === key) {
        return i;
      }
    }
  }
}

/**
* A strategy for iterating a template n number of times.
*/
export class NumberStrategy extends CollectionStrategy {
  /**
  * Return the strategies collection observer. In this case none.
  */
  getCollectionObserver() {
    return;
  }

  /**
  * Process the provided Number.
  * @param value The Number of how many time to iterate.
  */
  processItems(value) {
    let viewFactory = this.viewFactory;
    let viewSlot = this.viewSlot;
    let childrenLength = viewSlot.children.length;
    let i;
    let ii;
    let overrideContext;
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
      overrideContext = this.createFullOverrideContext(i, i, ii);
      view = viewFactory.create();
      view.bind(overrideContext.bindingContext, overrideContext);
      viewSlot.add(view);
    }

    this.updateOverrideContexts(0);
  }
}

/**
* Locates the best strategy to best iteraing different types of collections. Custom strategies can be plugged in as well.
*/
@inject(Container)
export class CollectionStrategyLocator {
  /**
  * Creates a new CollectionStrategyLocator.
  * @param container The dependency injection container.
  */
  constructor(container) {
    this.container = container;
    this.strategies = [];
    this.matchers = [];

    this.addStrategy(ArrayCollectionStrategy, items => items instanceof Array);
    this.addStrategy(MapCollectionStrategy, items => items instanceof Map);
    this.addStrategy(NumberStrategy, items => typeof items === 'number');
  }

  /**
  * Adds a collection strategy to be located when iterating different collection types.
  * @param collectionStrategy A collection strategy that can iterate a specific collection type.
  */
  addStrategy(collectionStrategy: Function, matcher: (items: any) => boolean) {
    this.strategies.push(collectionStrategy);
    this.matchers.push(matcher);
  }

  /**
  * Gets the best strategy to handle iteration.
  */
  getStrategy(items: any): CollectionStrategy {
    let matchers = this.matchers;

    for (let i = 0, ii = matchers.length; i < ii; ++i) {
      if (matchers[i](items)) {
        return this.container.get(this.strategies[i]);
      }
    }

    throw new Error('Object in "repeat" must have a valid collection strategy.');
  }
}

/*eslint no-loop-func:0, no-unused-vars:0*/
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
    this.sourceExpression = getSourceExpression(this.instruction, 'repeat.for');
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
    this.sourceExpression = null;
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
    if (!this._observeInnerCollection()) {
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

function configure(config) {
  if (FEATURE.shadowDOM) {
    DOM.injectStyles('body /deep/ .aurelia-hide { display:none !important; }');
  } else {
    DOM.injectStyles('.aurelia-hide { display:none !important; }');
  }

  config.globalResources(
    './compose',
    './if',
    './with',
    './repeat',
    './show',
    './replaceable',
    './sanitize-html',
    './focus',
    './compile-spy',
    './view-spy',
    './binding-mode-behaviors',
    './throttle-binding-behavior',
    './debounce-binding-behavior',
    './signal-binding-behavior',
    './update-trigger-binding-behavior'
  );

  let viewEngine = config.container.get(ViewEngine);
  let loader = config.aurelia.loader;

  viewEngine.addResourcePlugin('.html', {
    'fetch': function(address) {
      return loader.loadTemplate(address).then(registryEntry => {
        let bindable = registryEntry.template.getAttribute('bindable');
        let elementName = address.replace('.html', '');
        let index = elementName.lastIndexOf('/');

        if (index !== 0) {
          elementName = elementName.substring(index + 1);
        }

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

  viewEngine.addResourcePlugin('.css', {
    'fetch': function(address) {
      return { [address]: _createCSSResource(address) };
    }
  });
}

export {
  Compose,
  If,
  With,
  Repeat,
  Show,
  HTMLSanitizer,
  SanitizeHTMLValueConverter,
  Replaceable,
  Focus,
  CompileSpy,
  ViewSpy,
  configure,
  OneTimeBindingBehavior,
  OneWayBindingBehavior,
  TwoWayBindingBehavior,
  ThrottleBindingBehavior,
  DebounceBindingBehavior,
  SignalBindingBehavior,
  BindingSignaler,
  UpdateTriggerBindingBehavior
};
