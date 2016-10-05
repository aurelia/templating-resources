'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AttrBindingBehavior = undefined;

var _aureliaBinding = require('aurelia-binding');



var AttrBindingBehavior = exports.AttrBindingBehavior = function () {
  function AttrBindingBehavior() {
    
  }

  AttrBindingBehavior.prototype.bind = function bind(binding, source) {
    binding.targetObserver = new _aureliaBinding.DataAttributeObserver(binding.target, binding.targetProperty);
  };

  AttrBindingBehavior.prototype.unbind = function unbind(binding, source) {};

  return AttrBindingBehavior;
}();