'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BindingSignaler = undefined;

var _aureliaBinding = require('aurelia-binding');



var BindingSignaler = exports.BindingSignaler = function () {
  function BindingSignaler() {
    

    this.signals = {};
  }

  BindingSignaler.prototype.signal = function signal(name) {
    var bindings = this.signals[name];
    if (!bindings) {
      return;
    }
    var i = bindings.length;
    while (i--) {
      bindings[i].call(_aureliaBinding.sourceContext);
    }
  };

  return BindingSignaler;
}();