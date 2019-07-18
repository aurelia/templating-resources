import {Optional} from 'aurelia-dependency-injection';
import {customAttribute, Animator} from 'aurelia-templating';
import {DOM} from 'aurelia-pal';
import {injectAureliaHideStyleAtBoundary, AureliaHideStyle} from './aurelia-hide-style';

/**
 * Binding to conditionally show markup in the DOM based on the value.
 * - different from "if" in that the markup is still added to the DOM, simply not shown.
 */
@customAttribute('hide')
export class Hide {
  /**
   * @internal
   */
  element: any;
  /**
   * @internal
   */
  animator: any;
  /**
   * @internal
   */
  domBoundary: any;

  /**@internal */
  static inject() {
    return [DOM.Element, Animator, Optional.of(DOM.boundary, true)];
  }

  /**
   * Creates a new instance of Hide.
   * @param element Target element to conditionally hide.
   * @param animator The animator that conditionally adds or removes the aurelia-hide css class.
   * @param domBoundary The DOM boundary. Used when the behavior appears within a component that utilizes the shadow DOM.
   */
  constructor(element, animator, domBoundary) {
    this.element = element;
    this.animator = animator;
    this.domBoundary = domBoundary;
  }

  /**
   * Invoked when the behavior is created.
   */
  created() {
    injectAureliaHideStyleAtBoundary(this.domBoundary);
  }

  /**
   * Invoked everytime the bound value changes.
   * @param newValue The new value.
   */
  valueChanged(newValue) {
    if (newValue) {
      this.animator.addClass(this.element, AureliaHideStyle.instance().class());
    } else {
      this.animator.removeClass(this.element, AureliaHideStyle.instance().class());
    }
  }

  /**
   * Binds the Hide attribute.
   */
  bind(bindingContext) {
    this.valueChanged(this.value);
  }
  value(value: any) {
    throw new Error('Method not implemented.');
  }
}
