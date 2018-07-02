'use strict';

System.register(['aurelia-binding', 'aurelia-metadata'], function (_export, _context) {
  "use strict";

  var bindingMode, bindingBehavior, mixin, _dec, _dec2, _class, _dec3, _dec4, _class2, _dec5, _dec6, _class3, _dec7, _dec8, _class4, _dec9, _dec10, _class5, modeBindingBehavior, OneTimeBindingBehavior, OneWayBindingBehavior, ToViewBindingBehavior, FromViewBindingBehavior, TwoWayBindingBehavior;

  

  return {
    setters: [function (_aureliaBinding) {
      bindingMode = _aureliaBinding.bindingMode;
      bindingBehavior = _aureliaBinding.bindingBehavior;
    }, function (_aureliaMetadata) {
      mixin = _aureliaMetadata.mixin;
    }],
    execute: function () {
      modeBindingBehavior = {
        bind: function bind(binding, source, lookupFunctions) {
          binding.originalMode = binding.mode;
          binding.mode = this.mode;
        },
        unbind: function unbind(binding, source) {
          binding.mode = binding.originalMode;
          binding.originalMode = null;
        }
      };

      _export('OneTimeBindingBehavior', OneTimeBindingBehavior = (_dec = mixin(modeBindingBehavior), _dec2 = bindingBehavior('oneTime'), _dec(_class = _dec2(_class = function OneTimeBindingBehavior() {
        

        this.mode = bindingMode.oneTime;
      }) || _class) || _class));

      _export('OneTimeBindingBehavior', OneTimeBindingBehavior);

      _export('OneWayBindingBehavior', OneWayBindingBehavior = (_dec3 = mixin(modeBindingBehavior), _dec4 = bindingBehavior('oneWay'), _dec3(_class2 = _dec4(_class2 = function OneWayBindingBehavior() {
        

        this.mode = bindingMode.toView;
      }) || _class2) || _class2));

      _export('OneWayBindingBehavior', OneWayBindingBehavior);

      _export('ToViewBindingBehavior', ToViewBindingBehavior = (_dec5 = mixin(modeBindingBehavior), _dec6 = bindingBehavior('toView'), _dec5(_class3 = _dec6(_class3 = function ToViewBindingBehavior() {
        

        this.mode = bindingMode.toView;
      }) || _class3) || _class3));

      _export('ToViewBindingBehavior', ToViewBindingBehavior);

      _export('FromViewBindingBehavior', FromViewBindingBehavior = (_dec7 = mixin(modeBindingBehavior), _dec8 = bindingBehavior('fromView'), _dec7(_class4 = _dec8(_class4 = function FromViewBindingBehavior() {
        

        this.mode = bindingMode.fromView;
      }) || _class4) || _class4));

      _export('FromViewBindingBehavior', FromViewBindingBehavior);

      _export('TwoWayBindingBehavior', TwoWayBindingBehavior = (_dec9 = mixin(modeBindingBehavior), _dec10 = bindingBehavior('twoWay'), _dec9(_class5 = _dec10(_class5 = function TwoWayBindingBehavior() {
        

        this.mode = bindingMode.twoWay;
      }) || _class5) || _class5));

      _export('TwoWayBindingBehavior', TwoWayBindingBehavior);
    }
  };
});