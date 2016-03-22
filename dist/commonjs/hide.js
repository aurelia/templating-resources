'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Hide = undefined;

var _dec, _dec2, _class;

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaTemplating = require('aurelia-templating');

var _aureliaPal = require('aurelia-pal');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Hide = exports.Hide = (_dec = (0, _aureliaTemplating.customAttribute)('hide'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaPal.DOM.Element, _aureliaTemplating.Animator), _dec(_class = _dec2(_class = function () {
  function Hide(element, animator) {
    _classCallCheck(this, Hide);

    this.element = element;
    this.animator = animator;
  }

  Hide.prototype.valueChanged = function valueChanged(newValue) {
    if (newValue) {
      this.animator.addClass(this.element, 'aurelia-hide');
    } else {
      this.animator.removeClass(this.element, 'aurelia-hide');
    }
  };

  Hide.prototype.bind = function bind(bindingContext) {
    this.valueChanged(this.value);
  };

  return Hide;
}()) || _class) || _class);