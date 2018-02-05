import {bindingMode, bindingBehavior} from 'aurelia-binding';
import {mixin} from 'aurelia-metadata';

let modeBindingBehavior = {
  bind(binding, source, lookupFunctions) {
    binding.originalMode = binding.mode;
    binding.mode = this.mode;
  },

  unbind(binding, source) {
    binding.mode = binding.originalMode;
    binding.originalMode = null;
  }
};

@mixin(modeBindingBehavior)
@bindingBehavior('oneTime')
export class OneTimeBindingBehavior {
  constructor() {
    this.mode = bindingMode.oneTime;
  }
}

@mixin(modeBindingBehavior)
@bindingBehavior('oneWay')
export class OneWayBindingBehavior {
  constructor() {
    this.mode = bindingMode.toView;
  }
}

@mixin(modeBindingBehavior)
@bindingBehavior('toView')
export class ToViewBindingBehavior {
  constructor() {
    this.mode = bindingMode.toView;
  }
}

@mixin(modeBindingBehavior)
@bindingBehavior('fromView')
export class FromViewBindingBehavior {
  constructor() {
    this.mode = bindingMode.fromView;
  }
}

@mixin(modeBindingBehavior)
@bindingBehavior('twoWay')
export class TwoWayBindingBehavior {
  constructor() {
    this.mode = bindingMode.twoWay;
  }
}
