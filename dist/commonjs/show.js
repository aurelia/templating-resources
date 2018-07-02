'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Show = undefined;

var _dec, _class;

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaTemplating = require('aurelia-templating');

var _aureliaPal = require('aurelia-pal');

var _aureliaHideStyle = require('./aurelia-hide-style');



var Show = exports.Show = (_dec = (0, _aureliaTemplating.customAttribute)('show'), _dec(_class = function () {
  Show.inject = function inject() {
    return [_aureliaPal.DOM.Element, _aureliaTemplating.Animator, _aureliaDependencyInjection.Optional.of(_aureliaPal.DOM.boundary, true)];
  };

  function Show(element, animator, domBoundary) {
    

    this.element = element;
    this.animator = animator;
    this.domBoundary = domBoundary;
  }

  Show.prototype.created = function created() {
    (0, _aureliaHideStyle.injectAureliaHideStyleAtBoundary)(this.domBoundary);
  };

  Show.prototype.valueChanged = function valueChanged(newValue) {
    if (newValue) {
      this.animator.removeClass(this.element, _aureliaHideStyle.aureliaHideClassName);
    } else {
      this.animator.addClass(this.element, _aureliaHideStyle.aureliaHideClassName);
    }
  };

  Show.prototype.bind = function bind(bindingContext) {
    this.valueChanged(this.value);
  };

  return Show;
}()) || _class);