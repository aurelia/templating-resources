import {signalBindings} from 'aurelia-binding';
import * as LogManager from 'aurelia-logging';

export class BindingSignaler {
  constructor() {
    LogManager.getLogger('binding-signaler')
      .warn('Binding signaler signal has been deprecated. Please use \"import {signalBindings} from \'aurelia-binding\'\" instead.');
  }

  signal(name: string): void {
    signalBindings(name);
  }
}
