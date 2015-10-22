import {sourceContext} from 'aurelia-binding';

export class BindingSignaler {
  signals = {};

  signal(name: string): void {
    let bindings = this.signals[name];
    if (!bindings) {
      return;
    }
    let i = bindings.length;
    while (i--) {
      bindings[i].call(sourceContext);
    }
  }
}
