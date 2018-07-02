var _dec, _class;

import { bindingMode, sourceContext, targetContext, bindingBehavior } from 'aurelia-binding';

const unset = {};

function debounceCallSource(event) {
  const state = this.debounceState;
  clearTimeout(state.timeoutId);
  state.timeoutId = setTimeout(() => this.debouncedMethod(event), state.delay);
}

function debounceCall(context, newValue, oldValue) {
  const state = this.debounceState;
  clearTimeout(state.timeoutId);
  if (context !== state.callContextToDebounce) {
    state.oldValue = unset;
    this.debouncedMethod(context, newValue, oldValue);
    return;
  }
  if (state.oldValue === unset) {
    state.oldValue = oldValue;
  }
  state.timeoutId = setTimeout(() => {
    const _oldValue = state.oldValue;
    state.oldValue = unset;
    this.debouncedMethod(context, newValue, _oldValue);
  }, state.delay);
}

export let DebounceBindingBehavior = (_dec = bindingBehavior('debounce'), _dec(_class = class DebounceBindingBehavior {
  bind(binding, source, delay = 200) {
    const isCallSource = binding.callSource !== undefined;
    const methodToDebounce = isCallSource ? 'callSource' : 'call';
    const debouncer = isCallSource ? debounceCallSource : debounceCall;
    const mode = binding.mode;
    const callContextToDebounce = mode === bindingMode.twoWay || mode === bindingMode.fromView ? targetContext : sourceContext;

    binding.debouncedMethod = binding[methodToDebounce];
    binding.debouncedMethod.originalName = methodToDebounce;

    binding[methodToDebounce] = debouncer;

    binding.debounceState = {
      callContextToDebounce,
      delay,
      timeoutId: 0,
      oldValue: unset
    };
  }

  unbind(binding, source) {
    const methodToRestore = binding.debouncedMethod.originalName;
    binding[methodToRestore] = binding.debouncedMethod;
    binding.debouncedMethod = null;
    clearTimeout(binding.debounceState.timeoutId);
    binding.debounceState = null;
  }
}) || _class);