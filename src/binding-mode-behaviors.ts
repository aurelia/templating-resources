import { bindingBehavior, bindingMode } from 'aurelia-binding';
import { mixin } from 'aurelia-metadata';

let modeBindingBehavior = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  bind(binding, source, lookupFunctions) {
    binding.originalMode = binding.mode;
    binding.mode = this.mode;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unbind(binding, source) {
    binding.mode = binding.originalMode;
    binding.originalMode = null;
  }
};

@mixin(modeBindingBehavior)
@bindingBehavior('oneTime')
export class OneTimeBindingBehavior {

  mode: bindingMode;

  constructor() {
    this.mode = bindingMode.oneTime;
  }
}

@mixin(modeBindingBehavior)
@bindingBehavior('oneWay')
export class OneWayBindingBehavior {

  mode: bindingMode;

  constructor() {
    this.mode = bindingMode.toView;
  }
}

@mixin(modeBindingBehavior)
@bindingBehavior('toView')
export class ToViewBindingBehavior {

  mode: bindingMode;

  constructor() {
    this.mode = bindingMode.toView;
  }
}

@mixin(modeBindingBehavior)
@bindingBehavior('fromView')
export class FromViewBindingBehavior {

  mode: bindingMode;

  constructor() {
    this.mode = bindingMode.fromView;
  }
}

@mixin(modeBindingBehavior)
@bindingBehavior('twoWay')
export class TwoWayBindingBehavior {

  mode: bindingMode;

  constructor() {
    this.mode = bindingMode.twoWay;
  }
}
