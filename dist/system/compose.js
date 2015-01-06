System.register(["aurelia-dependency-injection", "aurelia-templating"], function (_export) {
  "use strict";

  var Container, CustomElement, CompositionEngine, Property, ViewSlot, NoView, ViewResources, Compose;


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
  return {
    setters: [function (_aureliaDependencyInjection) {
      Container = _aureliaDependencyInjection.Container;
    }, function (_aureliaTemplating) {
      CustomElement = _aureliaTemplating.CustomElement;
      CompositionEngine = _aureliaTemplating.CompositionEngine;
      Property = _aureliaTemplating.Property;
      ViewSlot = _aureliaTemplating.ViewSlot;
      NoView = _aureliaTemplating.NoView;
      ViewResources = _aureliaTemplating.ViewResources;
    }],
    execute: function () {
      Compose = function Compose(container, compositionEngine, viewSlot, viewResources) {
        this.container = container;
        this.compositionEngine = compositionEngine;
        this.viewSlot = viewSlot;
        this.viewResources = viewResources;
      };

      Compose.annotations = function () {
        return [new CustomElement("compose"), new Property("model"), new Property("view"), new Property("viewModel"), new NoView()];
      };

      Compose.inject = function () {
        return [Container, CompositionEngine, ViewSlot, ViewResources];
      };

      Compose.prototype.bind = function (executionContext) {
        this.executionContext = executionContext;
        processInstruction(this, {
          view: this.view,
          viewModel: this.viewModel,
          model: this.model
        });
      };

      Compose.prototype.modelChanged = function (newValue, oldValue) {
        if (this.viewModel && typeof this.viewModel.activate === "function") {
          this.viewModel.activate(newValue);
        }
      };

      Compose.prototype.viewChanged = function (newValue, oldValue) {
        processInstruction(this, { view: newValue });
      };

      Compose.prototype.viewModelChanged = function (newValue, oldValue) {
        processInstruction(this, { viewModel: newValue });
      };

      _export("Compose", Compose);
    }
  };
});