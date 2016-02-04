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
    if (arguments.length > 3) {
      binding.signalNames = [];
      let i = arguments.length;
      while (i-- > 2) {
        name = arguments[i];
        let bindings = this.signals[name] || (this.signals[name] = []);
        bindings.push(binding);
        binding.signalNames.push(name);
      }
    } else {
      let bindings = this.signals[name] || (this.signals[name] = []);
      bindings.push(binding);
      binding.signalNames = [name];
    }
  }

  unbind(binding, source) {
    let names = binding.signalNames;
    binding.signalNames = null;
    for (let name of names) {
      let bindings = this.signals[name];
      bindings.splice(bindings.indexOf(binding), 1);
    }
  }
}
