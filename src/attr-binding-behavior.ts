import {DataAttributeObserver, bindingBehavior} from 'aurelia-binding';

@bindingBehavior('attr')
export class AttrBindingBehavior {
  bind(binding, source) {
    binding.targetObserver = new DataAttributeObserver(binding.target, binding.targetProperty);
  }

  unbind(binding, source) {}
}
