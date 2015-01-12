define(["exports", "aurelia-dependency-injection", "aurelia-templating"], function (exports, _aureliaDependencyInjection, _aureliaTemplating) {
  "use strict";

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var Container = _aureliaDependencyInjection.Container;
  var CustomElement = _aureliaTemplating.CustomElement;
  var CompositionEngine = _aureliaTemplating.CompositionEngine;
  var Property = _aureliaTemplating.Property;
  var ViewSlot = _aureliaTemplating.ViewSlot;
  var NoView = _aureliaTemplating.NoView;
  var ViewResources = _aureliaTemplating.ViewResources;
  var Compose = (function () {
    var Compose = function Compose(container, compositionEngine, viewSlot, viewResources) {
      this.container = container;
      this.compositionEngine = compositionEngine;
      this.viewSlot = viewSlot;
      this.viewResources = viewResources;
    };

    _prototypeProperties(Compose, {
      annotations: {
        value: function () {
          return [new CustomElement("compose"), new Property("model"), new Property("view"), new Property("viewModel"), new NoView()];
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      inject: {
        value: function () {
          return [Container, CompositionEngine, ViewSlot, ViewResources];
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    }, {
      bind: {
        value: function (executionContext) {
          this.executionContext = executionContext;
          processInstruction(this, {
            view: this.view,
            viewModel: this.viewModel,
            model: this.model
          });
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      modelChanged: {
        value: function (newValue, oldValue) {
          if (this.viewModel && typeof this.viewModel.activate === "function") {
            this.viewModel.activate(newValue);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      viewChanged: {
        value: function (newValue, oldValue) {
          processInstruction(this, { view: newValue });
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      viewModelChanged: {
        value: function (newValue, oldValue) {
          processInstruction(this, { viewModel: newValue });
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return Compose;
  })();

  exports.Compose = Compose;


  function processInstruction(composer, instruction) {
    composer.compositionEngine.compose(Object.assign(instruction, {
      executionContext: composer.executionContext,
      container: composer.container,
      viewSlot: composer.viewSlot,
      viewResources: composer.viewResources,
      currentBehavior: composer.current
    })).then(function (next) {
      composer.current = next;
    });
  }
});