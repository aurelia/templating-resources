'use strict';

System.register(['aurelia-binding'], function (_export, _context) {
  "use strict";

  var DataAttributeObserver, AttrBindingBehavior;

  

  return {
    setters: [function (_aureliaBinding) {
      DataAttributeObserver = _aureliaBinding.DataAttributeObserver;
    }],
    execute: function () {
      _export('AttrBindingBehavior', AttrBindingBehavior = function () {
        function AttrBindingBehavior() {
          
        }

        AttrBindingBehavior.prototype.bind = function bind(binding, source) {
          binding.targetObserver = new DataAttributeObserver(binding.target, binding.targetProperty);
        };

        AttrBindingBehavior.prototype.unbind = function unbind(binding, source) {};

        return AttrBindingBehavior;
      }());

      _export('AttrBindingBehavior', AttrBindingBehavior);
    }
  };
});