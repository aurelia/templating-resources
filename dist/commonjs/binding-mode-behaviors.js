'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TwoWayBindingBehavior = exports.FromViewBindingBehavior = exports.ToViewBindingBehavior = exports.OneWayBindingBehavior = exports.OneTimeBindingBehavior = undefined;

var _dec, _dec2, _class, _dec3, _dec4, _class2, _dec5, _dec6, _class3, _dec7, _dec8, _class4, _dec9, _dec10, _class5;

var _aureliaBinding = require('aurelia-binding');

var _aureliaMetadata = require('aurelia-metadata');



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

var OneTimeBindingBehavior = exports.OneTimeBindingBehavior = (_dec = (0, _aureliaMetadata.mixin)(modeBindingBehavior), _dec2 = (0, _aureliaBinding.bindingBehavior)('oneTime'), _dec(_class = _dec2(_class = function OneTimeBindingBehavior() {
  

  this.mode = _aureliaBinding.bindingMode.oneTime;
}) || _class) || _class);
var OneWayBindingBehavior = exports.OneWayBindingBehavior = (_dec3 = (0, _aureliaMetadata.mixin)(modeBindingBehavior), _dec4 = (0, _aureliaBinding.bindingBehavior)('oneWay'), _dec3(_class2 = _dec4(_class2 = function OneWayBindingBehavior() {
  

  this.mode = _aureliaBinding.bindingMode.toView;
}) || _class2) || _class2);
var ToViewBindingBehavior = exports.ToViewBindingBehavior = (_dec5 = (0, _aureliaMetadata.mixin)(modeBindingBehavior), _dec6 = (0, _aureliaBinding.bindingBehavior)('toView'), _dec5(_class3 = _dec6(_class3 = function ToViewBindingBehavior() {
  

  this.mode = _aureliaBinding.bindingMode.toView;
}) || _class3) || _class3);
var FromViewBindingBehavior = exports.FromViewBindingBehavior = (_dec7 = (0, _aureliaMetadata.mixin)(modeBindingBehavior), _dec8 = (0, _aureliaBinding.bindingBehavior)('fromView'), _dec7(_class4 = _dec8(_class4 = function FromViewBindingBehavior() {
  

  this.mode = _aureliaBinding.bindingMode.fromView;
}) || _class4) || _class4);
var TwoWayBindingBehavior = exports.TwoWayBindingBehavior = (_dec9 = (0, _aureliaMetadata.mixin)(modeBindingBehavior), _dec10 = (0, _aureliaBinding.bindingBehavior)('twoWay'), _dec9(_class5 = _dec10(_class5 = function TwoWayBindingBehavior() {
  

  this.mode = _aureliaBinding.bindingMode.twoWay;
}) || _class5) || _class5);