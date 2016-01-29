'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaTemplating = require('aurelia-templating');

var _aureliaPal = require('aurelia-pal');

var Hide = (function () {
  function Hide(element, animator) {
    _classCallCheck(this, _Hide);

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

  var _Hide = Hide;
  Hide = _aureliaDependencyInjection.inject(_aureliaPal.DOM.Element, _aureliaTemplating.Animator)(Hide) || Hide;
  Hide = _aureliaTemplating.customAttribute('hide')(Hide) || Hide;
  return Hide;
})();

exports.Hide = Hide;