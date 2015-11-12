import {inject} from 'aurelia-dependency-injection';
import {customAttribute, Animator} from 'aurelia-templating';
import {DOM} from 'aurelia-pal';

/**
* Binding to conditionally show markup in the DOM based on the value.
* - different from "if" in that the markup is still added to the DOM, simply not shown.
*/
@customAttribute('show')
@inject(DOM.Element, Animator)
export class Show {
  /**
  * Creates a new instance of Show.
  * @param element Target element to conditionally show.
  * @param animator The animator that conditionally adds or removes the aurelia-hide css class.
  */
  constructor(element, animator) {
    this.element = element;
    this.animator = animator;
  }

  /**
  * Invoked everytime the bound value changes.
  * @param newValue The new value.
  */
  valueChanged(newValue) {
    if (newValue) {
      this.animator.removeClass(this.element, 'aurelia-hide');
    } else {
      this.animator.addClass(this.element, 'aurelia-hide');
    }
  }

  /**
  * Binds the Show attribute.
  */
  bind(bindingContext) {
    this.valueChanged(this.value);
  }
}
