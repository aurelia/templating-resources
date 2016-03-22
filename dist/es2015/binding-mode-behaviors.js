var _dec, _class, _dec2, _class2, _dec3, _class3;

import { bindingMode } from 'aurelia-binding';
import { mixin } from 'aurelia-metadata';

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

export let OneTimeBindingBehavior = (_dec = mixin(modeBindingBehavior), _dec(_class = class OneTimeBindingBehavior {
  constructor() {
    this.mode = bindingMode.oneTime;
  }
}) || _class);

export let OneWayBindingBehavior = (_dec2 = mixin(modeBindingBehavior), _dec2(_class2 = class OneWayBindingBehavior {
  constructor() {
    this.mode = bindingMode.oneWay;
  }
}) || _class2);

export let TwoWayBindingBehavior = (_dec3 = mixin(modeBindingBehavior), _dec3(_class3 = class TwoWayBindingBehavior {
  constructor() {
    this.mode = bindingMode.twoWay;
  }
}) || _class3);