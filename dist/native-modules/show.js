var _dec, _dec2, _class;



import { inject, Optional } from 'aurelia-dependency-injection';
import { customAttribute, Animator } from 'aurelia-templating';
import { DOM } from 'aurelia-pal';
import { injectAureliaHideStyleAtBoundary, aureliaHideClassName } from './aurelia-hide-style';

export var Show = (_dec = customAttribute('show'), _dec2 = inject(DOM.Element, Animator, Optional.of(DOM.boundary, true)), _dec(_class = _dec2(_class = function () {
  function Show(element, animator, domBoundary) {
    

    this.element = element;
    this.animator = animator;
    this.domBoundary = domBoundary;
  }

  Show.prototype.created = function created() {
    injectAureliaHideStyleAtBoundary(this.domBoundary);
  };

  Show.prototype.valueChanged = function valueChanged(newValue) {
    if (newValue) {
      this.animator.removeClass(this.element, aureliaHideClassName);
    } else {
      this.animator.addClass(this.element, aureliaHideClassName);
    }
  };

  Show.prototype.bind = function bind(bindingContext) {
    this.valueChanged(this.value);
  };

  return Show;
}()) || _class) || _class);