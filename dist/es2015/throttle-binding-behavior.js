var _dec, _class;

import { bindingMode, bindingBehavior } from 'aurelia-binding';

function throttle(newValue) {
  let state = this.throttleState;
  let elapsed = +new Date() - state.last;
  if (elapsed >= state.delay) {
    clearTimeout(state.timeoutId);
    state.timeoutId = null;
    state.last = +new Date();
    this.throttledMethod(newValue);
    return;
  }
  state.newValue = newValue;
  if (state.timeoutId === null) {
    state.timeoutId = setTimeout(() => {
      state.timeoutId = null;
      state.last = +new Date();
      this.throttledMethod(state.newValue);
    }, state.delay - elapsed);
  }
}

export let ThrottleBindingBehavior = (_dec = bindingBehavior('throttle'), _dec(_class = class ThrottleBindingBehavior {
  bind(binding, source, delay = 200) {
    let methodToThrottle = 'updateTarget';
    if (binding.callSource) {
      methodToThrottle = 'callSource';
    } else if (binding.updateSource && binding.mode === bindingMode.twoWay) {
      methodToThrottle = 'updateSource';
    }

    binding.throttledMethod = binding[methodToThrottle];
    binding.throttledMethod.originalName = methodToThrottle;

    binding[methodToThrottle] = throttle;

    binding.throttleState = {
      delay: delay,
      last: 0,
      timeoutId: null
    };
  }

  unbind(binding, source) {
    let methodToRestore = binding.throttledMethod.originalName;
    binding[methodToRestore] = binding.throttledMethod;
    binding.throttledMethod = null;
    clearTimeout(binding.throttleState.timeoutId);
    binding.throttleState = null;
  }
}) || _class);