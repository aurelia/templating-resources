var _dec, _class;



import { DataAttributeObserver, bindingBehavior } from 'aurelia-binding';

export var AttrBindingBehavior = (_dec = bindingBehavior('attr'), _dec(_class = function () {
  function AttrBindingBehavior() {
    
  }

  AttrBindingBehavior.prototype.bind = function bind(binding, source) {
    binding.targetObserver = new DataAttributeObserver(binding.target, binding.targetProperty);
  };

  AttrBindingBehavior.prototype.unbind = function unbind(binding, source) {};

  return AttrBindingBehavior;
}()) || _class);