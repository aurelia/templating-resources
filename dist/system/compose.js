'use strict';

System.register(['aurelia-dependency-injection', 'aurelia-task-queue', 'aurelia-templating', 'aurelia-pal'], function (_export, _context) {
  "use strict";

  var Container, inject, TaskQueue, CompositionEngine, ViewSlot, ViewResources, customElement, bindable, noView, View, DOM, _dec, _dec2, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, Compose;

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
    composer.compositionEngine.compose(instruction).then(function (controller) {
      composer.currentController = controller;
      composer.currentViewModel = controller ? controller.viewModel : null;
    });
  }
  return {
    setters: [function (_aureliaDependencyInjection) {
      Container = _aureliaDependencyInjection.Container;
      inject = _aureliaDependencyInjection.inject;
    }, function (_aureliaTaskQueue) {
      TaskQueue = _aureliaTaskQueue.TaskQueue;
    }, function (_aureliaTemplating) {
      CompositionEngine = _aureliaTemplating.CompositionEngine;
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
      _export('Compose', Compose = (_dec = customElement('compose'), _dec2 = inject(DOM.Element, Container, CompositionEngine, ViewSlot, ViewResources, TaskQueue), _dec(_class = noView(_class = _dec2(_class = (_class2 = function () {
        function Compose(element, container, compositionEngine, viewSlot, viewResources, taskQueue) {
          

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

        Compose.prototype.created = function created(owningView) {
          this.owningView = owningView;
        };

        Compose.prototype.bind = function bind(bindingContext, overrideContext) {
          this.bindingContext = bindingContext;
          this.overrideContext = overrideContext;
          processInstruction(this, createInstruction(this, {
            view: this.view,
            viewModel: this.viewModel,
            model: this.model
          }));
        };

        Compose.prototype.unbind = function unbind(bindingContext, overrideContext) {
          this.bindingContext = null;
          this.overrideContext = null;
          var returnToCache = true;
          var skipAnimation = true;
          this.viewSlot.removeAll(returnToCache, skipAnimation);
        };

        Compose.prototype.modelChanged = function modelChanged(newValue, oldValue) {
          var _this = this;

          if (this.currentInstruction) {
            this.currentInstruction.model = newValue;
            return;
          }

          this.taskQueue.queueMicroTask(function () {
            if (_this.currentInstruction) {
              _this.currentInstruction.model = newValue;
              return;
            }

            var vm = _this.currentViewModel;

            if (vm && typeof vm.activate === 'function') {
              vm.activate(newValue);
            }
          });
        };

        Compose.prototype.viewChanged = function viewChanged(newValue, oldValue) {
          var _this2 = this;

          var instruction = createInstruction(this, {
            view: newValue,
            viewModel: this.currentViewModel || this.viewModel,
            model: this.model
          });

          if (this.currentInstruction) {
            this.currentInstruction = instruction;
            return;
          }

          this.currentInstruction = instruction;
          this.taskQueue.queueMicroTask(function () {
            return processInstruction(_this2, _this2.currentInstruction);
          });
        };

        Compose.prototype.viewModelChanged = function viewModelChanged(newValue, oldValue) {
          var _this3 = this;

          var instruction = createInstruction(this, {
            viewModel: newValue,
            view: this.view,
            model: this.model
          });

          if (this.currentInstruction) {
            this.currentInstruction = instruction;
            return;
          }

          this.currentInstruction = instruction;
          this.taskQueue.queueMicroTask(function () {
            return processInstruction(_this3, _this3.currentInstruction);
          });
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
      })), _class2)) || _class) || _class) || _class));

      _export('Compose', Compose);
    }
  };
});