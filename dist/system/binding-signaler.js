'use strict';

System.register(['aurelia-binding'], function (_export, _context) {
  "use strict";

  var sourceContext, BindingSignaler;

  

  return {
    setters: [function (_aureliaBinding) {
      sourceContext = _aureliaBinding.sourceContext;
    }],
    execute: function () {
      _export('BindingSignaler', BindingSignaler = function () {
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
            bindings[i].call(sourceContext);
          }
        };

        return BindingSignaler;
      }());

      _export('BindingSignaler', BindingSignaler);
    }
  };
});