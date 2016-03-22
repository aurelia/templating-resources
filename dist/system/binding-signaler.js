'use strict';

System.register(['aurelia-binding'], function (_export, _context) {
  var sourceContext, BindingSignaler;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_aureliaBinding) {
      sourceContext = _aureliaBinding.sourceContext;
    }],
    execute: function () {
      _export('BindingSignaler', BindingSignaler = function () {
        function BindingSignaler() {
          _classCallCheck(this, BindingSignaler);

          this.signals = {};
        }

        BindingSignaler.prototype.signal = function signal(name) {
          var bindings = this.signals[name];
          if (!bindings) {
            return;
          }
          var i = bindings.length;
          while (i--) {
            bindings[i].call(sourceContext);
          }
        };

        return BindingSignaler;
      }());

      _export('BindingSignaler', BindingSignaler);
    }
  };
});