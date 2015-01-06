define(["exports", "aurelia-dependency-injection", "aurelia-templating"], function (exports, _aureliaDependencyInjection, _aureliaTemplating) {
  "use strict";

  var Container = _aureliaDependencyInjection.Container;
  var CustomElement = _aureliaTemplating.CustomElement;
  var CompositionEngine = _aureliaTemplating.CompositionEngine;
  var Property = _aureliaTemplating.Property;
  var ViewSlot = _aureliaTemplating.ViewSlot;
  var NoView = _aureliaTemplating.NoView;
  var ViewResources = _aureliaTemplating.ViewResources;
  var Compose = function Compose(container, compositionEngine, viewSlot, viewResources) {
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