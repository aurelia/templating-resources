'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SignalBindingBehavior = undefined;

var _dec, _class;

var _aureliaBinding = require('aurelia-binding');

var _bindingSignaler = require('./binding-signaler');



var SignalBindingBehavior = exports.SignalBindingBehavior = (_dec = (0, _aureliaBinding.bindingBehavior)('signal'), _dec(_class = function () {
  SignalBindingBehavior.inject = function inject() {
    return [_bindingSignaler.BindingSignaler];
  };

  function SignalBindingBehavior(bindingSignaler) {
    

    this.signals = bindingSignaler.signals;
  }

  SignalBindingBehavior.prototype.bind = function bind(binding, source) {
    if (!binding.updateTarget) {
      throw new Error('Only property bindings and string interpolation bindings can be signaled.  Trigger, delegate and call bindings cannot be signaled.');
    }

    for (var _len = arguments.length, names = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      names[_key - 2] = arguments[_key];
    }

    if (names.length === 1) {
      var name = names[0];
      var bindings = this.signals[name] || (this.signals[name] = []);
      bindings.push(binding);
      binding.signalName = name;
    } else if (names.length > 1) {
      var i = names.length;
      while (i--) {
        var _name = names[i];
        var _bindings = this.signals[_name] || (this.signals[_name] = []);
        _bindings.push(binding);
      }
      binding.signalName = names;
    } else {
      throw new Error('Signal name is required.');
    }
  };

  SignalBindingBehavior.prototype.unbind = function unbind(binding, source) {
    var name = binding.signalName;
    binding.signalName = null;
    if (Array.isArray(name)) {
      var _names = name;
      var i = _names.length;
      while (i--) {
        var n = _names[i];
        var bindings = this.signals[n];
        bindings.splice(bindings.indexOf(binding), 1);
      }
    } else {
      var _bindings2 = this.signals[name];
      _bindings2.splice(_bindings2.indexOf(binding), 1);
    }
  };

  return SignalBindingBehavior;
}()) || _class);