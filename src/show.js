import {inject} from 'aurelia-dependency-injection';
import {customAttribute, injectStyles, hasShadowDOM, Animator} from 'aurelia-templating';

if (hasShadowDOM) {
  injectStyles('body /deep/ .aurelia-hide { display:none !important; }');
} else {
  injectStyles('.aurelia-hide { display:none !important; }');
}

/**
* Binding to conditionally show markup in the DOM based on the value.
* - different from if in that the markup is still added to the DOM, simply not shown
*
* @class Show
* @constructor
* @param {Element} element The element that the to bind to
*/
@customAttribute('show')
@inject(Element, Animator)
export class Show {
  constructor(element, animator) {
    this.element = element;
    this.animator = animator;
  }

  valueChanged(newValue) {
    if (newValue) {
      this.animator.removeClass(this.element, 'aurelia-hide');
    } else {
      this.animator.addClass(this.element, 'aurelia-hide');
    }
  }

  bind(bindingContext) {
    this.valueChanged(this.value);
  }
}
