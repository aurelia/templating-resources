import {bindingBehavior} from 'aurelia-binding';
import {BindingSignaler} from './binding-signaler';

@bindingBehavior('signal')
export class SignalBindingBehavior {

  /**@internal */
  static inject() { return [BindingSignaler]; }
  signals;

  constructor(bindingSignaler) {
    this.signals = bindingSignaler.signals;
  }

  bind(binding, source, ...names) {
    if (!binding.updateTarget) {
      throw new Error('Only property bindings and string interpolation bindings can be signaled.  Trigger, delegate and call bindings cannot be signaled.');
    }
    let signals = this.signals;
    if (names.length === 1) {
      let name = names[0];
      let bindings = signals[name] || (signals[name] = []);
      bindings.push(binding);
      binding.signalName = name;
    } else if (names.length > 1) {
      let i = names.length;
      while (i--) {
        let name = names[i];
        let bindings = signals[name] || (signals[name] = []);
        bindings.push(binding);
      }
      binding.signalName = names;
    } else {
      throw new Error('Signal name is required.');
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unbind(binding, source) {
    let signals = this.signals;
    let name = binding.signalName;
    binding.signalName = null;
    if (Array.isArray(name)) {
      let names = name;
      let i = names.length;
      while (i--) {
        let n = names[i];
        let bindings = signals[n];
        bindings.splice(bindings.indexOf(binding), 1);
      }
    } else {
      let bindings = signals[name];
      bindings.splice(bindings.indexOf(binding), 1);
    }
  }
}
