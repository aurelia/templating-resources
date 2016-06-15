var _dec, _dec2, _class;



import { inject, Optional } from 'aurelia-dependency-injection';
import { customAttribute, Animator } from 'aurelia-templating';
import { DOM } from 'aurelia-pal';
import { injectAureliaHideStyleAtBoundary, aureliaHideClassName } from './aurelia-hide-style';

export var Hide = (_dec = customAttribute('hide'), _dec2 = inject(DOM.Element, Animator, Optional.of(DOM.boundary, true)), _dec(_class = _dec2(_class = function () {
  function Hide(element, animator, domBoundary) {
    

    this.element = element;
    this.animator = animator;
    this.domBoundary = domBoundary;
  }

  Hide.prototype.created = function created() {
    injectAureliaHideStyleAtBoundary(this.domBoundary);
  };

  Hide.prototype.valueChanged = function valueChanged(newValue) {
    if (newValue) {
      this.animator.addClass(this.element, aureliaHideClassName);
    } else {
      this.animator.removeClass(this.element, aureliaHideClassName);
    }
  };

  Hide.prototype.bind = function bind(bindingContext) {
    this.valueChanged(this.value);
  };

  return Hide;
}()) || _class) || _class);