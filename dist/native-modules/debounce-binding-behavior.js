var _dec, _class;



import { bindingMode, sourceContext, targetContext, bindingBehavior } from 'aurelia-binding';

var unset = {};

function debounceCallSource(event) {
  var _this = this;

  var state = this.debounceState;
  clearTimeout(state.timeoutId);
  state.timeoutId = setTimeout(function () {
    return _this.debouncedMethod(event);
  }, state.delay);
}

function debounceCall(context, newValue, oldValue) {
  var _this2 = this;

  var state = this.debounceState;
  clearTimeout(state.timeoutId);
  if (context !== state.callContextToDebounce) {
    state.oldValue = unset;
    this.debouncedMethod(context, newValue, oldValue);
    return;
  }
  if (state.oldValue === unset) {
    state.oldValue = oldValue;
  }
  state.timeoutId = setTimeout(function () {
    var _oldValue = state.oldValue;
    state.oldValue = unset;
    _this2.debouncedMethod(context, newValue, _oldValue);
  }, state.delay);
}

export var DebounceBindingBehavior = (_dec = bindingBehavior('debounce'), _dec(_class = function () {
  function DebounceBindingBehavior() {
    
  }

  DebounceBindingBehavior.prototype.bind = function bind(binding, source) {
    var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 200;

    var isCallSource = binding.callSource !== undefined;
    var methodToDebounce = isCallSource ? 'callSource' : 'call';
    var debouncer = isCallSource ? debounceCallSource : debounceCall;
    var mode = binding.mode;
    var callContextToDebounce = mode === bindingMode.twoWay || mode === bindingMode.fromView ? targetContext : sourceContext;

    binding.debouncedMethod = binding[methodToDebounce];
    binding.debouncedMethod.originalName = methodToDebounce;

    binding[methodToDebounce] = debouncer;

    binding.debounceState = {
      callContextToDebounce: callContextToDebounce,
      delay: delay,
      timeoutId: 0,
      oldValue: unset
    };
  };

  DebounceBindingBehavior.prototype.unbind = function unbind(binding, source) {
    var methodToRestore = binding.debouncedMethod.originalName;
    binding[methodToRestore] = binding.debouncedMethod;
    binding.debouncedMethod = null;
    clearTimeout(binding.debounceState.timeoutId);
    binding.debounceState = null;
  };

  return DebounceBindingBehavior;
}()) || _class);