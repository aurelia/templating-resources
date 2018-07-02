'use strict';

System.register(['aurelia-dependency-injection', 'aurelia-task-queue', 'aurelia-templating', 'aurelia-pal'], function (_export, _context) {
  "use strict";

  var Container, TaskQueue, CompositionEngine, CompositionContext, ViewSlot, ViewResources, customElement, bindable, noView, View, DOM, _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, Compose;

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

  function isEmpty(obj) {
    for (var key in obj) {
      return false;
    }
    return true;
  }

  function tryActivateViewModel(vm, model) {
    if (vm && typeof vm.activate === 'function') {
      return Promise.resolve(vm.activate(model));
    }
  }

  function createInstruction(composer, instruction) {
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

  function processChanges(composer) {
    var changes = composer.changes;
    composer.changes = Object.create(null);

    if (!('view' in changes) && !('viewModel' in changes) && 'model' in changes) {
      composer.pendingTask = tryActivateViewModel(composer.currentViewModel, changes.model);
      if (!composer.pendingTask) {
        return;
      }
    } else {
      var instruction = {
        view: composer.view,
        viewModel: composer.currentViewModel || composer.viewModel,
        model: composer.model
      };

      instruction = Object.assign(instruction, changes);

      instruction = createInstruction(composer, instruction);
      composer.pendingTask = composer.compositionEngine.compose(instruction).then(function (controller) {
        composer.currentController = controller;
        composer.currentViewModel = controller ? controller.viewModel : null;
      });
    }

    composer.pendingTask = composer.pendingTask.then(function () {
      completeCompositionTask(composer);
    }, function (reason) {
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

  function requestUpdate(composer) {
    if (composer.pendingTask || composer.updateRequested) {
      return;
    }
    composer.updateRequested = true;
    composer.taskQueue.queueMicroTask(function () {
      composer.updateRequested = false;
      processChanges(composer);
    });
  }
  return {
    setters: [function (_aureliaDependencyInjection) {
      Container = _aureliaDependencyInjection.Container;
    }, function (_aureliaTaskQueue) {
      TaskQueue = _aureliaTaskQueue.TaskQueue;
    }, function (_aureliaTemplating) {
      CompositionEngine = _aureliaTemplating.CompositionEngine;
      CompositionContext = _aureliaTemplating.CompositionContext;
      ViewSlot = _aureliaTemplating.ViewSlot;
      ViewResources = _aureliaTemplating.ViewResources;
      customElement = _aureliaTemplating.customElement;
      bindable = _aureliaTemplating.bindable;
      noView = _aureliaTemplating.noView;
      View = _aureliaTemplating.View;
    }, function (_aureliaPal) {
      DOM = _aureliaPal.DOM;
    }],
    execute: function () {
      _export('Compose', Compose = (_dec = customElement('compose'), _dec(_class = noView(_class = (_class2 = function () {
        Compose.inject = function inject() {
          return [DOM.Element, Container, CompositionEngine, ViewSlot, ViewResources, TaskQueue];
        };

        function Compose(element, container, compositionEngine, viewSlot, viewResources, taskQueue) {
          

          _initDefineProp(this, 'model', _descriptor, this);

          _initDefineProp(this, 'view', _descriptor2, this);

          _initDefineProp(this, 'viewModel', _descriptor3, this);

          _initDefineProp(this, 'swapOrder', _descriptor4, this);

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

        Compose.prototype.created = function created(owningView) {
          this.owningView = owningView;
        };

        Compose.prototype.bind = function bind(bindingContext, overrideContext) {
          this.bindingContext = bindingContext;
          this.overrideContext = overrideContext;
          this.changes.view = this.view;
          this.changes.viewModel = this.viewModel;
          this.changes.model = this.model;
          if (!this.pendingTask) {
            processChanges(this);
          }
        };

        Compose.prototype.unbind = function unbind() {
          this.changes = Object.create(null);
          this.bindingContext = null;
          this.overrideContext = null;
          var returnToCache = true;
          var skipAnimation = true;
          this.viewSlot.removeAll(returnToCache, skipAnimation);
        };

        Compose.prototype.modelChanged = function modelChanged(newValue, oldValue) {
          this.changes.model = newValue;
          requestUpdate(this);
        };

        Compose.prototype.viewChanged = function viewChanged(newValue, oldValue) {
          this.changes.view = newValue;
          requestUpdate(this);
        };

        Compose.prototype.viewModelChanged = function viewModelChanged(newValue, oldValue) {
          this.changes.viewModel = newValue;
          requestUpdate(this);
        };

        return Compose;
      }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'model', [bindable], {
        enumerable: true,
        initializer: null
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'view', [bindable], {
        enumerable: true,
        initializer: null
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'viewModel', [bindable], {
        enumerable: true,
        initializer: null
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'swapOrder', [bindable], {
        enumerable: true,
        initializer: null
      })), _class2)) || _class) || _class));

      _export('Compose', Compose);
    }
  };
});