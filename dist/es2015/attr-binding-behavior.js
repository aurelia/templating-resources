var _dec, _class;

import { DataAttributeObserver, bindingBehavior } from 'aurelia-binding';

export let AttrBindingBehavior = (_dec = bindingBehavior('attr'), _dec(_class = class AttrBindingBehavior {
  bind(binding, source) {
    binding.targetObserver = new DataAttributeObserver(binding.target, binding.targetProperty);
  }

  unbind(binding, source) {}
}) || _class);