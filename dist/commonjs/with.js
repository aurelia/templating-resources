'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.With = undefined;

var _dec, _dec2, _class;

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaTemplating = require('aurelia-templating');

var _aureliaBinding = require('aurelia-binding');



var With = exports.With = (_dec = (0, _aureliaTemplating.customAttribute)('with'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.ViewSlot), _dec(_class = (0, _aureliaTemplating.templateController)(_class = _dec2(_class = function () {
  function With(viewFactory, viewSlot) {
    

    this.viewFactory = viewFactory;
    this.viewSlot = viewSlot;
    this.parentOverrideContext = null;
    this.view = null;
  }

  With.prototype.bind = function bind(bindingContext, overrideContext) {
    this.parentOverrideContext = overrideContext;
    this.valueChanged(this.value);
  };

  With.prototype.valueChanged = function valueChanged(newValue) {
    var overrideContext = (0, _aureliaBinding.createOverrideContext)(newValue, this.parentOverrideContext);
    if (!this.view) {
      this.view = this.viewFactory.create();
      this.view.bind(newValue, overrideContext);
      this.viewSlot.add(this.view);
    } else {
      this.view.bind(newValue, overrideContext);
    }
  };

  With.prototype.unbind = function unbind() {
    this.parentOverrideContext = null;

    if (this.view) {
      this.view.unbind();
    }
  };

  return With;
}()) || _class) || _class) || _class);