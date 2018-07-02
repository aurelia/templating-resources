'use strict';

System.register(['aurelia-binding'], function (_export, _context) {
  "use strict";

  var DataAttributeObserver, bindingBehavior, _dec, _class, AttrBindingBehavior;

  

  return {
    setters: [function (_aureliaBinding) {
      DataAttributeObserver = _aureliaBinding.DataAttributeObserver;
      bindingBehavior = _aureliaBinding.bindingBehavior;
    }],
    execute: function () {
      _export('AttrBindingBehavior', AttrBindingBehavior = (_dec = bindingBehavior('attr'), _dec(_class = function () {
        function AttrBindingBehavior() {
          
        }

        AttrBindingBehavior.prototype.bind = function bind(binding, source) {
          binding.targetObserver = new DataAttributeObserver(binding.target, binding.targetProperty);
        };

        AttrBindingBehavior.prototype.unbind = function unbind(binding, source) {};

        return AttrBindingBehavior;
      }()) || _class));

      _export('AttrBindingBehavior', AttrBindingBehavior);
    }
  };
});