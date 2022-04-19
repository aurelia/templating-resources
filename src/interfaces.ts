/* eslint-disable @typescript-eslint/no-unused-vars */
import { BindingExpression } from 'aurelia-binding';
import { TargetInstruction } from 'aurelia-templating';

/**@internal */
declare module 'aurelia-templating' {
  interface ViewFactory {
    template: DocumentFragment;
  }
}

/**@internal */
declare module 'aurelia-binding' {
  interface BindingExpression {
    targetProperty: string;
  }
}
