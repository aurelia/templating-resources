var _dec, _dec2, _class;

import { customAttribute, TargetInstruction } from 'aurelia-templating';
import { inject } from 'aurelia-dependency-injection';
import * as LogManager from 'aurelia-logging';
import { DOM } from 'aurelia-pal';

export let CompileSpy = (_dec = customAttribute('compile-spy'), _dec2 = inject(DOM.Element, TargetInstruction), _dec(_class = _dec2(_class = class CompileSpy {
  constructor(element, instruction) {
    LogManager.getLogger('compile-spy').info(element, instruction);
  }
}) || _class) || _class);