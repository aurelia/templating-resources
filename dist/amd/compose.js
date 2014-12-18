define(["exports", "aurelia-dependency-injection", "aurelia-templating"], function (exports, _aureliaDependencyInjection, _aureliaTemplating) {
  "use strict";

  var Container = _aureliaDependencyInjection.Container;
  var CustomElement = _aureliaTemplating.CustomElement;
  var ResourceCoordinator = _aureliaTemplating.ResourceCoordinator;
  var Property = _aureliaTemplating.Property;
  var ViewSlot = _aureliaTemplating.ViewSlot;
  var NoView = _aureliaTemplating.NoView;
  var UseView = _aureliaTemplating.UseView;
  var ViewEngine = _aureliaTemplating.ViewEngine;
  var ViewResources = _aureliaTemplating.ViewResources;
  var Compose = (function () {
    var Compose = function Compose(container, resourceCoordinator, viewEngine, viewSlot, viewResources) {
      this.container = container;
      this.resourceCoordinator = resourceCoordinator;
      this.viewEngine = viewEngine;
      this.viewSlot = viewSlot;
      this.viewResources = viewResources;
    };

    Compose.annotations = function () {
      return [new CustomElement("compose"), new Property("model"), new Property("view"), new Property("viewModel"), new NoView()];
    };

    Compose.inject = function () {
      return [Container, ResourceCoordinator, ViewEngine, ViewSlot, ViewResources];
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
      if (this.viewModel && this.viewModel.activate) {
        this.viewModel.activate(newValue);
      }
    };

    Compose.prototype.viewChanged = function (newValue, oldValue) {
      processInstruction(this, { view: newValue });
    };

    Compose.prototype.viewModelChanged = function (newValue, oldValue) {
      processInstruction(this, { viewModel: newValue });
    };

    return Compose;
  })();

  exports.Compose = Compose;


  function swap(composer, behavior) {
    behavior.bind(behavior.executionContext);
    composer.viewSlot.swap(behavior.view);

    if (composer.current) {
      composer.current.unbind();
    }

    composer.current = behavior;
  }

  function processBehavior(composer, instruction, behavior) {
    if (instruction.model && "activate" in instruction.viewModel) {
      var activated = instruction.viewModel.activate(instruction.model) || Promise.resolve();
      activated.then(function () {
        return swap(composer, behavior);
      });
    } else {
      swap(composer, behavior);
    }
  }

  function processInstruction(composer, instruction) {
    var useView, result, options, childContainer;

    if (instruction.view) {
      instruction.view = composer.viewResources.relativeToView(instruction.view);
    }

    if (typeof instruction.viewModel === "string") {
      instruction.viewModel = composer.viewResources.relativeToView(instruction.viewModel);
      composer.resourceCoordinator.loadAnonymousElement(instruction.viewModel, null, instruction.view).then(function (type) {
        childContainer = composer.container.createChild();
        options = { suppressBind: true };
        result = type.create(childContainer, options);
        instruction.viewModel = result.executionContext;
        processBehavior(composer, instruction, result);
      });
    } else {
      if (instruction.view) {
        useView = new UseView(instruction.view);
      }

      if (instruction.viewModel) {
        CustomElement.anonymous(composer.container, instruction.viewModel, useView).then(function (type) {
          childContainer = composer.container.createChild();
          options = { executionContext: instruction.viewModel, suppressBind: true };
          result = type.create(childContainer, options);
          processBehavior(composer, instruction, result);
        });
      } else if (useView) {
        useView.loadViewFactory(composer.viewEngine).then(function (viewFactory) {
          childContainer = composer.container.createChild();
          result = viewFactory.create(childContainer, composer.executionContext);
          composer.viewSlot.swap(result);
        });
      }
    }
  }
});