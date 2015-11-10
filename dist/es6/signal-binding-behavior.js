import {bindingMode} from 'aurelia-binding';
import {BindingSignaler} from './binding-signaler';

export class SignalBindingBehavior {
  static inject() { return [BindingSignaler]; }
  signals;

  constructor(bindingSignaler) {
    this.signals = bindingSignaler.signals;
  }

  bind(binding, source, name) {
    if (!binding.updateTarget) {
      throw new Error('Only property bindings and string interpolation bindings can be signaled.  Trigger, delegate and call bindings cannot be signaled.');
    }
    if (binding.mode === bindingMode.oneTime) {
      throw new Error('One-time bindings cannot be signaled.');
    }
    let bindings = this.signals[name] || (this.signals[name] = []);
    bindings.push(binding);
    binding.signalName = name;
  }

  unbind(binding, source) {
    let name = binding.signalName;
    binding.signalName = null;
    let bindings = signals[name];
    bindings.splice(bindings.indexOf(binding), 1);
  }
}
