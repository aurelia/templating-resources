import {customAttribute, TargetInstruction} from 'aurelia-templating';
import {inject} from 'aurelia-dependency-injection';
import * as LogManager from 'aurelia-logging';
import {DOM} from 'aurelia-pal';

/**
* Attribute to be placed on any element to have it emit the View Compiler's
* TargetInstruction into the debug console, giving you insight into all the
* parsed bindings, behaviors and event handers for the targeted element.
*/
@customAttribute('compile-spy')
@inject(DOM.Element, TargetInstruction)
export class CompileSpy {
  /**
  * Creates and instanse of CompileSpy.
  * @param element target element on where attribute is placed on.
  * @param instruction instructions for how the target element should be enhanced.
  */
  constructor(element, instruction) {
    LogManager.getLogger('compile-spy').info(element, instruction);
  }
}
