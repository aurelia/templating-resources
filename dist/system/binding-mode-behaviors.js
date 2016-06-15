'use strict';

System.register(['aurelia-binding', 'aurelia-metadata'], function (_export, _context) {
  "use strict";

  var bindingMode, mixin, _dec, _class, _dec2, _class2, _dec3, _class3, modeBindingBehavior, OneTimeBindingBehavior, OneWayBindingBehavior, TwoWayBindingBehavior;

  

  return {
    setters: [function (_aureliaBinding) {
      bindingMode = _aureliaBinding.bindingMode;
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

      _export('OneTimeBindingBehavior', OneTimeBindingBehavior = (_dec = mixin(modeBindingBehavior), _dec(_class = function OneTimeBindingBehavior() {
        

        this.mode = bindingMode.oneTime;
      }) || _class));

      _export('OneTimeBindingBehavior', OneTimeBindingBehavior);

      _export('OneWayBindingBehavior', OneWayBindingBehavior = (_dec2 = mixin(modeBindingBehavior), _dec2(_class2 = function OneWayBindingBehavior() {
        

        this.mode = bindingMode.oneWay;
      }) || _class2));

      _export('OneWayBindingBehavior', OneWayBindingBehavior);

      _export('TwoWayBindingBehavior', TwoWayBindingBehavior = (_dec3 = mixin(modeBindingBehavior), _dec3(_class3 = function TwoWayBindingBehavior() {
        

        this.mode = bindingMode.twoWay;
      }) || _class3));

      _export('TwoWayBindingBehavior', TwoWayBindingBehavior);
    }
  };
});