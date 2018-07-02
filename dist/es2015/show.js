var _dec, _class;

import { Optional } from 'aurelia-dependency-injection';
import { customAttribute, Animator } from 'aurelia-templating';
import { DOM } from 'aurelia-pal';
import { injectAureliaHideStyleAtBoundary, aureliaHideClassName } from './aurelia-hide-style';

export let Show = (_dec = customAttribute('show'), _dec(_class = class Show {

  static inject() {
    return [DOM.Element, Animator, Optional.of(DOM.boundary, true)];
  }

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
      this.animator.removeClass(this.element, aureliaHideClassName);
    } else {
      this.animator.addClass(this.element, aureliaHideClassName);
    }
  }

  bind(bindingContext) {
    this.valueChanged(this.value);
  }
}) || _class);