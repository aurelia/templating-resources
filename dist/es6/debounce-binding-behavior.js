import {bindingMode} from 'aurelia-binding';

function debounce(newValue) {
  let state = this.debounceState;
  if (state.immediate) {
    state.immediate = false;
    this.debouncedMethod(newValue);
    return;
  }
  clearTimeout(state.timeoutId);
  state.timeoutId = setTimeout(
    () => this.debouncedMethod(newValue),
    state.delay);
}

export class DebounceBindingBehavior {
  bind(binding, source, delay = 200) {
    // determine which method to debounce.
    let methodToDebounce = 'updateTarget'; // one-way bindings or interpolation bindings
    if (binding.callSource) {
      methodToDebounce = 'callSource';     // listener and call bindings
    } else if (binding.updateSource && binding.mode === bindingMode.twoWay) {
      methodToDebounce = 'updateSource';   // two-way bindings
    }

    // stash the original method and it's name.
    // note: a generic name like "originalMethod" is not used to avoid collisions
    // with other binding behavior types.
    binding.debouncedMethod = binding[methodToDebounce];
    binding.debouncedMethod.originalName = methodToDebounce;

    // replace the original method with the debouncing version.
    binding[methodToDebounce] = debounce;

    // create the debounce state.
    binding.debounceState = {
      delay: delay,
      timeoutId: null,
      immediate: methodToDebounce === 'updateTarget' // should not delay initial target update that occurs during bind.
    };
  }

  unbind(binding, source) {
    // restore the state of the binding.
    let methodToRestore = binding.debouncedMethod.originalName;
    binding[methodToRestore] = binding.debouncedMethod;
    binding.debouncedMethod = null;
    clearTimeout(binding.debounceState.timeoutId);
    binding.debounceState = null;
  }
}
