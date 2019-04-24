import {inject} from 'aurelia-dependency-injection';
import {BoundViewFactory, ViewSlot, customAttribute, templateController, ViewFactory} from 'aurelia-templating';
import {createOverrideContext} from 'aurelia-binding';

/**
 * Creates a binding context for decandant elements to bind to.
 */
@customAttribute('with')
@templateController
@inject(BoundViewFactory, ViewSlot)
export class With {

  /**@internal*/
  viewFactory: any;
  /**@internal*/
  viewSlot: any;
  /**@internal*/
  parentOverrideContext: any;
  /**@internal*/
  view: any;

  value: any;

  /**
   * Creates an instance of With.
   * @param viewFactory The factory generating the view.
   * @param viewSlot The slot the view is injected in to.
   */
  constructor(viewFactory: ViewFactory, viewSlot: ViewSlot) {
    this.viewFactory = viewFactory;
    this.viewSlot = viewSlot;
    this.parentOverrideContext = null;
    this.view = null;
  }

  /**
   * Binds the With with provided binding context and override context.
   * @param bindingContext The binding context.
   * @param overrideContext An override context for binding.
   */
  bind(bindingContext, overrideContext) {
    this.parentOverrideContext = overrideContext;
    this.valueChanged(this.value);
  }

  /**
   * Invoked everytime the bound value changes.
   * @param newValue The new value.
   */
  valueChanged(newValue) {
    let overrideContext = createOverrideContext(newValue, this.parentOverrideContext);
    let view = this.view;
    if (!view) {
      view = this.view = this.viewFactory.create();
      view.bind(newValue, overrideContext);
      this.viewSlot.add(view);
    } else {
      view.bind(newValue, overrideContext);
    }
  }

  /**
   * Unbinds With
   */
  unbind() {
    let view = this.view;
    this.parentOverrideContext = null;

    if (view) {
      view.unbind();
    }
  }
}
