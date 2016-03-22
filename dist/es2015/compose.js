var _dec, _dec2, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3;

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _initializerWarningHelper(descriptor, context) {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

import { Container, inject } from 'aurelia-dependency-injection';
import { TaskQueue } from 'aurelia-task-queue';
import { CompositionEngine, ViewSlot, ViewResources, customElement, bindable, noView, View } from 'aurelia-templating';
import { DOM } from 'aurelia-pal';

export let Compose = (_dec = customElement('compose'), _dec2 = inject(DOM.Element, Container, CompositionEngine, ViewSlot, ViewResources, TaskQueue), _dec(_class = noView(_class = _dec2(_class = (_class2 = class Compose {
  constructor(element, container, compositionEngine, viewSlot, viewResources, taskQueue) {
    _initDefineProp(this, 'model', _descriptor, this);

    _initDefineProp(this, 'view', _descriptor2, this);

    _initDefineProp(this, 'viewModel', _descriptor3, this);

    this.element = element;
    this.container = container;
    this.compositionEngine = compositionEngine;
    this.viewSlot = viewSlot;
    this.viewResources = viewResources;
    this.taskQueue = taskQueue;
    this.currentController = null;
    this.currentViewModel = null;
  }

  created(owningView) {
    this.owningView = owningView;
  }

  bind(bindingContext, overrideContext) {
    this.bindingContext = bindingContext;
    this.overrideContext = overrideContext;
    processInstruction(this, createInstruction(this, {
      view: this.view,
      viewModel: this.viewModel,
      model: this.model
    }));
  }

  unbind(bindingContext, overrideContext) {
    this.bindingContext = null;
    this.overrideContext = null;
    let returnToCache = true;
    let skipAnimation = true;
    this.viewSlot.removeAll(returnToCache, skipAnimation);
  }

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
}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'model', [bindable], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'view', [bindable], {
  enumerable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'viewModel', [bindable], {
  enumerable: true,
  initializer: null
})), _class2)) || _class) || _class) || _class);

function createInstruction(composer, instruction) {
  return Object.assign(instruction, {
    bindingContext: composer.bindingContext,
    overrideContext: composer.overrideContext,
    owningView: composer.owningView,
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