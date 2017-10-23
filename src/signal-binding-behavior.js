import {connectBindingToSignal} from 'aurelia-binding';

export class SignalBindingBehavior {
  bind(binding, source) {
    if (!binding.updateTarget) {
      throw new Error('Only property bindings and string interpolation bindings can be signaled.  Trigger, delegate and call bindings cannot be signaled.');
    }
    if (arguments.length < 3) {
      throw new Error('Signal name is required');
    }
    let i = arguments.length;
    while (i > 2) {
      connectBindingToSignal(binding, arguments[i]);
      i--;
    }
  }
}
