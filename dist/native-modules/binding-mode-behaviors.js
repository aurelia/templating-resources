var _dec, _class, _dec2, _class2, _dec3, _class3;



import { bindingMode } from 'aurelia-binding';
import { mixin } from 'aurelia-metadata';

var modeBindingBehavior = {
  bind: function bind(binding, source, lookupFunctions) {
    binding.originalMode = binding.mode;
    binding.mode = this.mode;
  },
  unbind: function unbind(binding, source) {
    binding.mode = binding.originalMode;
    binding.originalMode = null;
  }
};

export var OneTimeBindingBehavior = (_dec = mixin(modeBindingBehavior), _dec(_class = function OneTimeBindingBehavior() {
  

  this.mode = bindingMode.oneTime;
}) || _class);

export var OneWayBindingBehavior = (_dec2 = mixin(modeBindingBehavior), _dec2(_class2 = function OneWayBindingBehavior() {
  

  this.mode = bindingMode.oneWay;
}) || _class2);

export var TwoWayBindingBehavior = (_dec3 = mixin(modeBindingBehavior), _dec3(_class3 = function TwoWayBindingBehavior() {
  

  this.mode = bindingMode.twoWay;
}) || _class3);