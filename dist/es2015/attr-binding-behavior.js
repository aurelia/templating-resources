import { DataAttributeObserver } from 'aurelia-binding';

export let AttrBindingBehavior = class AttrBindingBehavior {
  bind(binding, source) {
    binding.targetObserver = new DataAttributeObserver(binding.target, binding.targetProperty);
  }

  unbind(binding, source) {}
};