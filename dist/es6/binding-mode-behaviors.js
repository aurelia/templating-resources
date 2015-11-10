import {bindingMode} from 'aurelia-binding';

class ModeBindingBehavior {
  constructor(mode) {
    this.mode = mode;
  }

  bind(binding, source, lookupFunctions) {
    binding.originalMode = binding.mode;
    binding.mode = this.mode;
  }

  unbind(binding, source) {
    binding.mode = binding.originalMode;
    binding.originalMode = null;
  }
}

export class OneTimeBindingBehavior extends ModeBindingBehavior {
  constructor() {
    super(bindingMode.oneTime);
  }
}

export class OneWayBindingBehavior extends ModeBindingBehavior {
  constructor() {
    super(bindingMode.oneWay);
  }
}

export class TwoWayBindingBehavior extends ModeBindingBehavior {
  constructor() {
    super(bindingMode.twoWay);
  }
}
