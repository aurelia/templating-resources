import {bindingBehavior} from 'aurelia-binding';
import {BindingSignaler} from './binding-signaler';

@bindingBehavior('signal')
export class SignalBindingBehavior {
  static inject() { return [BindingSignaler]; }
  signals;

  constructor(bindingSignaler) {
    this.signals = bindingSignaler.signals;
  }

  bind(binding, source, ...names) {
    if (!binding.updateTarget) {
      throw new Error('Only property bindings and string interpolation bindings can be signaled.  Trigger, delegate and call bindings cannot be signaled.');
    }
    if (names.length === 1) {
      let name = names[0];
      let bindings = this.signals[name] || (this.signals[name] = []);
      bindings.push(binding);
      binding.signalName = name;
    } else if (names.length > 1) {
      let i = names.length;
      while (i--) {
        let name = names[i];
        let bindings = this.signals[name] || (this.signals[name] = []);
        bindings.push(binding);
      }
      binding.signalName = names;
    } else {
      throw new Error('Signal name is required.');
    }
  }

  unbind(binding, source) {
    let name = binding.signalName;
    binding.signalName = null;
    if (Array.isArray(name)) {
      let names = name;
      let i = names.length;
      while (i--) {
        let n = names[i];
        let bindings = this.signals[n];
        bindings.splice(bindings.indexOf(binding), 1);
      }
    } else {
      let bindings = this.signals[name];
      bindings.splice(bindings.indexOf(binding), 1);
    }
  }
}
