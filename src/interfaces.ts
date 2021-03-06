import { BindingExpression } from 'aurelia-binding';
import { TargetInstruction } from 'aurelia-templating';

/**@internal */
declare module 'aurelia-templating' {
  interface ViewFactory {
    instructions: Record<string, TargetInstruction>;
    template: DocumentFragment;
  }
}

/**@internal */
declare module 'aurelia-binding' {
  interface BindingExpression {
    targetProperty: string;
  }
}
