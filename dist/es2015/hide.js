var _dec, _dec2, _class;

import { inject } from 'aurelia-dependency-injection';
import { customAttribute, Animator } from 'aurelia-templating';
import { DOM } from 'aurelia-pal';

export let Hide = (_dec = customAttribute('hide'), _dec2 = inject(DOM.Element, Animator), _dec(_class = _dec2(_class = class Hide {
  constructor(element, animator) {
    this.element = element;
    this.animator = animator;
  }

  valueChanged(newValue) {
    if (newValue) {
      this.animator.addClass(this.element, 'aurelia-hide');
    } else {
      this.animator.removeClass(this.element, 'aurelia-hide');
    }
  }

  bind(bindingContext) {
    this.valueChanged(this.value);
  }
}) || _class) || _class);