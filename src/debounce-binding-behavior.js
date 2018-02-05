import {
  bindingMode,
  sourceContext,
  targetContext,
  bindingBehavior
} from 'aurelia-binding';

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

@bindingBehavior('debounce')
export class DebounceBindingBehavior {
  bind(binding, source, delay = 200) {
    const isCallSource = binding.callSource !== undefined;
    const methodToDebounce = isCallSource ? 'callSource' : 'call';
    const debouncer = isCallSource ? debounceCallSource : debounceCall;
    const mode = binding.mode;
    const callContextToDebounce = mode === bindingMode.twoWay || mode === bindingMode.fromView ? targetContext : sourceContext;

    // stash the original method and it's name.
    // note: a generic name like "originalMethod" is not used to avoid collisions
    // with other binding behavior types.
    binding.debouncedMethod = binding[methodToDebounce];
    binding.debouncedMethod.originalName = methodToDebounce;

    // replace the original method with the debouncing version.
    binding[methodToDebounce] = debouncer;

    // create the debounce state.
    binding.debounceState = {
      callContextToDebounce,
      delay,
      timeoutId: 0,
      oldValue: unset
    };
  }

  unbind(binding, source) {
    // restore the state of the binding.
    const methodToRestore = binding.debouncedMethod.originalName;
    binding[methodToRestore] = binding.debouncedMethod;
    binding.debouncedMethod = null;
    clearTimeout(binding.debounceState.timeoutId);
    binding.debounceState = null;
  }
}
