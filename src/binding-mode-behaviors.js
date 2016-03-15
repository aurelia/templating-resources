import {bindingMode} from 'aurelia-binding';
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
export class OneTimeBindingBehavior {
  constructor() {
    this.mode = bindingMode.oneTime;
  }
}

@mixin(modeBindingBehavior)
export class OneWayBindingBehavior {
  constructor() {
    this.mode = bindingMode.oneWay;
  }
}

@mixin(modeBindingBehavior)
export class TwoWayBindingBehavior {
  constructor() {
    this.mode = bindingMode.twoWay;
  }
}
