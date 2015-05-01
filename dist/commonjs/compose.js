'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;

var _Container$inject = require('aurelia-dependency-injection');

var _CompositionEngine$ViewSlot$ViewResources$customElement$bindable$noView = require('aurelia-templating');

var Compose = (function () {
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

  Compose = _Container$inject.inject(_Container$inject.Container, _CompositionEngine$ViewSlot$ViewResources$customElement$bindable$noView.CompositionEngine, _CompositionEngine$ViewSlot$ViewResources$customElement$bindable$noView.ViewSlot, _CompositionEngine$ViewSlot$ViewResources$customElement$bindable$noView.ViewResources)(Compose) || Compose;
  Compose = _CompositionEngine$ViewSlot$ViewResources$customElement$bindable$noView.noView(Compose) || Compose;
  Compose = _CompositionEngine$ViewSlot$ViewResources$customElement$bindable$noView.bindable('viewModel')(Compose) || Compose;
  Compose = _CompositionEngine$ViewSlot$ViewResources$customElement$bindable$noView.bindable('view')(Compose) || Compose;
  Compose = _CompositionEngine$ViewSlot$ViewResources$customElement$bindable$noView.bindable('model')(Compose) || Compose;
  Compose = _CompositionEngine$ViewSlot$ViewResources$customElement$bindable$noView.customElement('compose')(Compose) || Compose;
  return Compose;
})();

exports.Compose = Compose;

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