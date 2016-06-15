var _dec, _dec2, _class;

import { inject, Optional } from 'aurelia-dependency-injection';
import { customAttribute, Animator } from 'aurelia-templating';
import { DOM } from 'aurelia-pal';
import { injectAureliaHideStyleAtBoundary, aureliaHideClassName } from './aurelia-hide-style';

export let Hide = (_dec = customAttribute('hide'), _dec2 = inject(DOM.Element, Animator, Optional.of(DOM.boundary, true)), _dec(_class = _dec2(_class = class Hide {
  constructor(element, animator, domBoundary) {
    this.element = element;
    this.animator = animator;
    this.domBoundary = domBoundary;
  }

  created() {
    injectAureliaHideStyleAtBoundary(this.domBoundary);
  }

  valueChanged(newValue) {
    if (newValue) {
      this.animator.addClass(this.element, aureliaHideClassName);
    } else {
      this.animator.removeClass(this.element, aureliaHideClassName);
    }
  }

  bind(bindingContext) {
    this.valueChanged(this.value);
  }
}) || _class) || _class);