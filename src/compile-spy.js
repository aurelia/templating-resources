import {customAttribute, TargetInstruction} from 'aurelia-templating';
import {inject} from 'aurelia-dependency-injection';
import * as LogManager from 'aurelia-logging';

@customAttribute('compile-spy')
@inject(Element, TargetInstruction)
export class CompileSpy {
  constructor(element, instruction) {
    LogManager.getLogger('compile-spy').info(element, instruction);
  }
}
