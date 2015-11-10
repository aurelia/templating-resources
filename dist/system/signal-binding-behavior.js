System.register(['aurelia-binding', './binding-signaler'], function (_export) {
  'use strict';

  var bindingMode, BindingSignaler, SignalBindingBehavior;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaBinding) {
      bindingMode = _aureliaBinding.bindingMode;
    }, function (_bindingSignaler) {
      BindingSignaler = _bindingSignaler.BindingSignaler;
    }],
    execute: function () {
      SignalBindingBehavior = (function () {
        SignalBindingBehavior.inject = function inject() {
          return [BindingSignaler];
        };

        function SignalBindingBehavior(bindingSignaler) {
          _classCallCheck(this, SignalBindingBehavior);

          this.signals = bindingSignaler.signals;
        }

        SignalBindingBehavior.prototype.bind = function bind(binding, source, name) {
          if (!binding.updateTarget) {
            throw new Error('Only property bindings and string interpolation bindings can be signaled.  Trigger, delegate and call bindings cannot be signaled.');
          }
          if (binding.mode === bindingMode.oneTime) {
            throw new Error('One-time bindings cannot be signaled.');
          }
          var bindings = this.signals[name] || (this.signals[name] = []);
          bindings.push(binding);
          binding.signalName = name;
        };

        SignalBindingBehavior.prototype.unbind = function unbind(binding, source) {
          var name = binding.signalName;
          binding.signalName = null;
          var bindings = signals[name];
          bindings.splice(bindings.indexOf(binding), 1);
        };

        return SignalBindingBehavior;
      })();

      _export('SignalBindingBehavior', SignalBindingBehavior);
    }
  };
});