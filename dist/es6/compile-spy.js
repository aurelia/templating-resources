import {customAttribute, TargetInstruction} from 'aurelia-templating';
import {inject} from 'aurelia-dependency-injection';
import * as LogManager from 'aurelia-logging';
import {DOM} from 'aurelia-pal';

@customAttribute('compile-spy')
@inject(DOM.Element, TargetInstruction)
export class CompileSpy {
  constructor(element, instruction) {
    LogManager.getLogger('compile-spy').info(element, instruction);
  }
}
