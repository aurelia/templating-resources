System.register(['aurelia-dependency-injection', 'aurelia-templating'], function (_export) {
  var Container, inject, CompositionEngine, ViewSlot, ViewResources, customElement, bindable, noView, _classCallCheck, Compose;

  function processInstruction(composer, instruction) {
    composer.compositionEngine.compose(Object.assign(instruction, {
      executionContext: composer.executionContext,
      container: composer.container,
      viewSlot: composer.viewSlot,
      viewResources: composer.viewResources,
      currentBehavior: composer.currentBehavior
    })).then(function (next) {
      composer.currentBehavior = next;
      composer.currentViewModel = next ? next.executionContext : null;
    });
  }
  return {
    setters: [function (_aureliaDependencyInjection) {
      Container = _aureliaDependencyInjection.Container;
      inject = _aureliaDependencyInjection.inject;
    }, function (_aureliaTemplating) {
      CompositionEngine = _aureliaTemplating.CompositionEngine;
      ViewSlot = _aureliaTemplating.ViewSlot;
      ViewResources = _aureliaTemplating.ViewResources;
      customElement = _aureliaTemplating.customElement;
      bindable = _aureliaTemplating.bindable;
      noView = _aureliaTemplating.noView;
    }],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      Compose = (function () {
        function Compose(container, compositionEngine, viewSlot, viewResources) {
          _classCallCheck(this, _Compose);

          this.container = container;
          this.compositionEngine = compositionEngine;
          this.viewSlot = viewSlot;
          this.viewResources = viewResources;
        }

        var _Compose = Compose;

        _Compose.prototype.bind = function bind(executionContext) {
          this.executionContext = executionContext;
          processInstruction(this, { view: this.view, viewModel: this.viewModel, model: this.model });
        };

        _Compose.prototype.modelChanged = function modelChanged(newValue, oldValue) {
          var vm = this.currentViewModel;

          if (vm && typeof vm.activate === 'function') {
            vm.activate(newValue);
          }
        };

        _Compose.prototype.viewChanged = function viewChanged(newValue, oldValue) {
          processInstruction(this, { view: newValue, viewModel: this.currentViewModel || this.viewModel, model: this.model });
        };

        _Compose.prototype.viewModelChanged = function viewModelChanged(newValue, oldValue) {
          processInstruction(this, { viewModel: newValue, view: this.view, model: this.model });
        };

        Compose = inject(Container, CompositionEngine, ViewSlot, ViewResources)(Compose) || Compose;
        Compose = noView(Compose) || Compose;
        Compose = bindable('viewModel')(Compose) || Compose;
        Compose = bindable('view')(Compose) || Compose;
        Compose = bindable('model')(Compose) || Compose;
        Compose = customElement('compose')(Compose) || Compose;
        return Compose;
      })();

      _export('Compose', Compose);
    }
  };
});