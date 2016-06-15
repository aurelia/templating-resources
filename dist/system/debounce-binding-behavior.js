'use strict';

System.register(['aurelia-binding'], function (_export, _context) {
  "use strict";

  var bindingMode, DebounceBindingBehavior;

  

  function debounce(newValue) {
    var _this = this;

    var state = this.debounceState;
    if (state.immediate) {
      state.immediate = false;
      this.debouncedMethod(newValue);
      return;
    }
    clearTimeout(state.timeoutId);
    state.timeoutId = setTimeout(function () {
      return _this.debouncedMethod(newValue);
    }, state.delay);
  }

  return {
    setters: [function (_aureliaBinding) {
      bindingMode = _aureliaBinding.bindingMode;
    }],
    execute: function () {
      _export('DebounceBindingBehavior', DebounceBindingBehavior = function () {
        function DebounceBindingBehavior() {
          
        }

        DebounceBindingBehavior.prototype.bind = function bind(binding, source) {
          var delay = arguments.length <= 2 || arguments[2] === undefined ? 200 : arguments[2];

          var methodToDebounce = 'updateTarget';
          if (binding.callSource) {
            methodToDebounce = 'callSource';
          } else if (binding.updateSource && binding.mode === bindingMode.twoWay) {
              methodToDebounce = 'updateSource';
            }

          binding.debouncedMethod = binding[methodToDebounce];
          binding.debouncedMethod.originalName = methodToDebounce;

          binding[methodToDebounce] = debounce;

          binding.debounceState = {
            delay: delay,
            timeoutId: null,
            immediate: methodToDebounce === 'updateTarget' };
        };

        DebounceBindingBehavior.prototype.unbind = function unbind(binding, source) {
          var methodToRestore = binding.debouncedMethod.originalName;
          binding[methodToRestore] = binding.debouncedMethod;
          binding.debouncedMethod = null;
          clearTimeout(binding.debounceState.timeoutId);
          binding.debounceState = null;
        };

        return DebounceBindingBehavior;
      }());

      _export('DebounceBindingBehavior', DebounceBindingBehavior);
    }
  };
});