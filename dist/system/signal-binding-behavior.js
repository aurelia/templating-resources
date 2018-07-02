'use strict';

System.register(['aurelia-binding', './binding-signaler'], function (_export, _context) {
  "use strict";

  var bindingBehavior, BindingSignaler, _dec, _class, SignalBindingBehavior;

  

  return {
    setters: [function (_aureliaBinding) {
      bindingBehavior = _aureliaBinding.bindingBehavior;
    }, function (_bindingSignaler) {
      BindingSignaler = _bindingSignaler.BindingSignaler;
    }],
    execute: function () {
      _export('SignalBindingBehavior', SignalBindingBehavior = (_dec = bindingBehavior('signal'), _dec(_class = function () {
        SignalBindingBehavior.inject = function inject() {
          return [BindingSignaler];
        };

        function SignalBindingBehavior(bindingSignaler) {
          

          this.signals = bindingSignaler.signals;
        }

        SignalBindingBehavior.prototype.bind = function bind(binding, source) {
          if (!binding.updateTarget) {
            throw new Error('Only property bindings and string interpolation bindings can be signaled.  Trigger, delegate and call bindings cannot be signaled.');
          }
          if (arguments.length === 3) {
            var name = arguments[2];
            var bindings = this.signals[name] || (this.signals[name] = []);
            bindings.push(binding);
            binding.signalName = name;
          } else if (arguments.length > 3) {
            var names = Array.prototype.slice.call(arguments, 2);
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
            var names = name;
            var i = names.length;
            while (i--) {
              var n = names[i];
              var bindings = this.signals[n];
              bindings.splice(bindings.indexOf(binding), 1);
            }
          } else {
            var _bindings2 = this.signals[name];
            _bindings2.splice(_bindings2.indexOf(binding), 1);
          }
        };

        return SignalBindingBehavior;
      }()) || _class));

      _export('SignalBindingBehavior', SignalBindingBehavior);
    }
  };
});