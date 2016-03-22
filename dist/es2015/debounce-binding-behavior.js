import { bindingMode } from 'aurelia-binding';

function debounce(newValue) {
  let state = this.debounceState;
  if (state.immediate) {
    state.immediate = false;
    this.debouncedMethod(newValue);
    return;
  }
  clearTimeout(state.timeoutId);
  state.timeoutId = setTimeout(() => this.debouncedMethod(newValue), state.delay);
}

export let DebounceBindingBehavior = class DebounceBindingBehavior {
  bind(binding, source, delay = 200) {
    let methodToDebounce = 'updateTarget';
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
  }

  unbind(binding, source) {
    let methodToRestore = binding.debouncedMethod.originalName;
    binding[methodToRestore] = binding.debouncedMethod;
    binding.debouncedMethod = null;
    clearTimeout(binding.debounceState.timeoutId);
    binding.debounceState = null;
  }
};