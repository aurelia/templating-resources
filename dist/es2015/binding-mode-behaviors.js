var _dec, _dec2, _class, _dec3, _dec4, _class2, _dec5, _dec6, _class3, _dec7, _dec8, _class4, _dec9, _dec10, _class5;

import { bindingMode, bindingBehavior } from 'aurelia-binding';
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

export let OneTimeBindingBehavior = (_dec = mixin(modeBindingBehavior), _dec2 = bindingBehavior('oneTime'), _dec(_class = _dec2(_class = class OneTimeBindingBehavior {
  constructor() {
    this.mode = bindingMode.oneTime;
  }
}) || _class) || _class);

export let OneWayBindingBehavior = (_dec3 = mixin(modeBindingBehavior), _dec4 = bindingBehavior('oneWay'), _dec3(_class2 = _dec4(_class2 = class OneWayBindingBehavior {
  constructor() {
    this.mode = bindingMode.toView;
  }
}) || _class2) || _class2);

export let ToViewBindingBehavior = (_dec5 = mixin(modeBindingBehavior), _dec6 = bindingBehavior('toView'), _dec5(_class3 = _dec6(_class3 = class ToViewBindingBehavior {
  constructor() {
    this.mode = bindingMode.toView;
  }
}) || _class3) || _class3);

export let FromViewBindingBehavior = (_dec7 = mixin(modeBindingBehavior), _dec8 = bindingBehavior('fromView'), _dec7(_class4 = _dec8(_class4 = class FromViewBindingBehavior {
  constructor() {
    this.mode = bindingMode.fromView;
  }
}) || _class4) || _class4);

export let TwoWayBindingBehavior = (_dec9 = mixin(modeBindingBehavior), _dec10 = bindingBehavior('twoWay'), _dec9(_class5 = _dec10(_class5 = class TwoWayBindingBehavior {
  constructor() {
    this.mode = bindingMode.twoWay;
  }
}) || _class5) || _class5);