import { sourceContext } from 'aurelia-binding';

export let BindingSignaler = class BindingSignaler {
  constructor() {
    this.signals = {};
  }

  signal(name) {
    let bindings = this.signals[name];
    if (!bindings) {
      return;
    }
    let i = bindings.length;
    while (i--) {
      bindings[i].call(sourceContext);
    }
  }
};