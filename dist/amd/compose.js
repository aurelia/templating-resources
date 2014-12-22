define(["exports", "aurelia-dependency-injection", "aurelia-templating"], function (exports, _aureliaDependencyInjection, _aureliaTemplating) {
  "use strict";

  var Container = _aureliaDependencyInjection.Container;
  var CustomElement = _aureliaTemplating.CustomElement;
  var ResourceCoordinator = _aureliaTemplating.ResourceCoordinator;
  var Property = _aureliaTemplating.Property;
  var ViewSlot = _aureliaTemplating.ViewSlot;
  var NoView = _aureliaTemplating.NoView;
  var UseView = _aureliaTemplating.UseView;
  var ViewStrategy = _aureliaTemplating.ViewStrategy;
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
    if (instruction.model && typeof instruction.viewModel.activate === "function") {
      var activated = instruction.viewModel.activate(instruction.model) || Promise.resolve();
      activated.then(function () {
        return swap(composer, behavior);
      });
    } else {
      swap(composer, behavior);
    }
  }

  function processInstructionView(composer, instruction) {
    if (typeof instruction.view === "string") {
      instruction.view = new UseView(composer.viewResources.relativeToView(instruction.view));
    }

    if (instruction.view && !(instruction.view instanceof ViewStrategy)) {
      throw new Error("The view must be a string or an instance of ViewStrategy.");
    }
  }

  function processViewModel(composer, instruction, container) {
    if ("getViewStrategy" in instruction.viewModel && !instruction.view) {
      instruction.view = instruction.viewModel.getViewStrategy();
      processInstructionView(composer, instruction);
    }

    CustomElement.anonymous(composer.container, instruction.viewModel, instruction.view).then(function (type) {
      var childContainer = container || composer.container.createChild();
      var behavior = type.create(childContainer, { executionContext: instruction.viewModel, suppressBind: true });
      processBehavior(composer, instruction, behavior);
    });
  }

  function processInstruction(composer, instruction) {
    var result, options, childContainer;

    processInstructionView(composer, instruction);

    if (typeof instruction.viewModel === "string") {
      instruction.viewModel = composer.viewResources.relativeToView(instruction.viewModel);

      composer.resourceCoordinator.loadViewModelType(instruction.viewModel).then(function (viewModelType) {
        childContainer = composer.container.createChild();
        instruction.viewModel = childContainer.get(viewModelType);
        processViewModel(composer, instruction, childContainer);
      });
    } else {
      if (instruction.viewModel) {
        processViewModel(composer, instruction);
      } else if (instruction.view) {
        instruction.view.loadViewFactory(composer.viewEngine).then(function (viewFactory) {
          childContainer = composer.container.createChild();
          result = viewFactory.create(childContainer, composer.executionContext);
          composer.viewSlot.swap(result);
        });
      }
    }
  }
});