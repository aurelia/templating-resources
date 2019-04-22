import {bindingMode, bindingBehavior} from 'aurelia-binding';

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
    state.timeoutId = setTimeout(
      () => {
        state.timeoutId = null;
        state.last = +new Date();
        this.throttledMethod(state.newValue);
      },
      state.delay - elapsed);
  }
}

@bindingBehavior('throttle')
export class ThrottleBindingBehavior {
  bind(binding, source, delay = 200) {
    // determine which method to throttle.
    let methodToThrottle = 'updateTarget'; // one-way bindings or interpolation bindings
    if (binding.callSource) {
      methodToThrottle = 'callSource';     // listener and call bindings
    } else if (binding.updateSource && binding.mode === bindingMode.twoWay) {
      methodToThrottle = 'updateSource';   // two-way bindings
    }

    // stash the original method and it's name.
    // note: a generic name like "originalMethod" is not used to avoid collisions
    // with other binding behavior types.
    binding.throttledMethod = binding[methodToThrottle];
    binding.throttledMethod.originalName = methodToThrottle;

    // replace the original method with the throttling version.
    binding[methodToThrottle] = throttle;

    // create the throttle state.
    binding.throttleState = {
      delay: delay,
      last: 0,
      timeoutId: null
    };
  }

  unbind(binding, source) {
    // restore the state of the binding.
    let methodToRestore = binding.throttledMethod.originalName;
    binding[methodToRestore] = binding.throttledMethod;
    binding.throttledMethod = null;
    clearTimeout(binding.throttleState.timeoutId);
    binding.throttleState = null;
  }
}
