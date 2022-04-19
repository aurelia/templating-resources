import { Container } from 'aurelia-dependency-injection';
import { DOM } from 'aurelia-pal';
import { TaskQueue } from 'aurelia-task-queue';
import { bindable, CompositionContext, CompositionEngine, customElement, noView, View, ViewResources, ViewSlot } from 'aurelia-templating';

/**
 * Available activation strategies for the view and view-model bound to `<compose/>` element
 *
 * @export
 * @enum {string}
 */
export enum ActivationStrategy {
  /**
   * Default activation strategy; the 'activate' lifecycle hook will be invoked when the model changes.
   */
  InvokeLifecycle = 'invoke-lifecycle',
  /**
   * The view/view-model will be recreated, when the "model" changes.
   */
  Replace = 'replace'
}

/**
 * Used to compose a new view / view-model template or bind to an existing instance.
 */
@noView
@customElement('compose')
export class Compose {

  /**@internal */
  static inject() {
    return [DOM.Element, Container, CompositionEngine, ViewSlot, ViewResources, TaskQueue];
  }

  /**
   * Model to bind the custom element to.
   *
   * @property model
   * @type {CustomElement}
   */
  @bindable model: any;
  /**
   * View to bind the custom element to.
   *
   * @property view
   * @type {HtmlElement}
   */
  @bindable view: any;
  /**
   * View-model to bind the custom element's template to.
   *
   * @property viewModel
   * @type {Class}
   */
  @bindable viewModel: any;

  /**
   * Strategy to activate the view-model. Default is "invoke-lifecycle".
   * Bind "replace" to recreate the view/view-model when the model changes.
   *
   * @property activationStrategy
   * @type {ActivationStrategy}
   */
  @bindable activationStrategy: ActivationStrategy = ActivationStrategy.InvokeLifecycle;

  /**
   * SwapOrder to control the swapping order of the custom element's view.
   *
   * @property view
   * @type {String}
   */
  @bindable swapOrder: any;

  /**
   *@internal
   */
  element: any;
  /**
   *@internal
   */
  container: any;
  /**
   *@internal
   */
  compositionEngine: any;
  /**
   *@internal
   */
  viewSlot: any;
  /**
   *@internal
   */
  viewResources: any;
  /**
   *@internal
   */
  taskQueue: any;
  /**
   *@internal
   */
  currentController: any;
  /**
   *@internal
   */
  currentViewModel: any;
  /**
   *@internal
   */
  changes: any;
  /**
   *@internal
   */
  owningView: View;
  /**
   *@internal
   */
  bindingContext: any;
  /**
   *@internal
   */
  overrideContext: any;
  /**
   *@internal
   */
  pendingTask: any;
  /**
   *@internal
   */
  updateRequested: any;

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
    let changes = this.changes;
    changes.view = this.view;
    changes.viewModel = this.viewModel;
    changes.model = this.model;
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  modelChanged(newValue, oldValue) {
    this.changes.model = newValue;
    requestUpdate(this);
  }

  /**
   * Invoked everytime the bound view changes.
   * @param newValue The new value.
   * @param oldValue The old value.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  viewChanged(newValue, oldValue) {
    this.changes.view = newValue;
    requestUpdate(this);
  }

  /**
   * Invoked everytime the bound view model changes.
   * @param newValue The new value.
   * @param oldValue The old value.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  viewModelChanged(newValue, oldValue) {
    this.changes.viewModel = newValue;
    requestUpdate(this);
  }
}

function isEmpty(obj) {
  for (const _ in obj) {
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

  if (needsReInitialization(composer, changes)) {
    // init context
    let instruction = {
      view: composer.view,
      viewModel: composer.currentViewModel || composer.viewModel,
      model: composer.model
    } as CompositionContext;

    // apply changes
    instruction = Object.assign(instruction, changes);

    // create context
    instruction = createInstruction(composer, instruction);

    composer.pendingTask = composer.compositionEngine.compose(instruction).then(controller => {
      composer.currentController = controller;
      composer.currentViewModel = controller ? controller.viewModel : null;
    });
  } else {
    // just try to activate the current view model
    composer.pendingTask = tryActivateViewModel(composer.currentViewModel, changes.model);
    if (!composer.pendingTask) { return; }
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

function needsReInitialization(composer: Compose, changes: any) {
  let activationStrategy = composer.activationStrategy;
  const vm = composer.currentViewModel;
  if (vm && typeof vm.determineActivationStrategy === 'function') {
    activationStrategy = vm.determineActivationStrategy();
  }

  return 'view' in changes
    || 'viewModel' in changes
    || activationStrategy === ActivationStrategy.Replace;
}
