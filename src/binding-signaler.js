import {sourceContext, signalBindings} from 'aurelia-binding';
import * as LogManager from 'aurelia-logging';

export class BindingSignaler {

  constructor() {
    this.logger = LogManager.getLogger('binding-signaler');
  }
  
  signal(name: string): void {
    this.logger
      .warn(`Binding signaler signal has been deprecated. Please use "import {signalBindings} from 'aurelia-binding' instead.`);
    signalBindings(name);
  }
}
