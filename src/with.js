import {inject} from 'aurelia-dependency-injection';
import {BoundViewFactory, ViewSlot, customAttribute, templateController} from 'aurelia-templating';
import {createOverrideContext} from 'aurelia-binding';

/**
* Creates a binding context for decandant elements to bind to.
*/
@customAttribute('with')
@templateController
@inject(BoundViewFactory, ViewSlot)
export class With {
  /**
  * Creates an instance of With.
  * @param viewFactory The factory generating the view.
  * @param viewSlot The slot the view is injected in to.
  */
  constructor(viewFactory, viewSlot) {
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
    if (!this.view) {
      this.view = this.viewFactory.create();
      this.view.bind(newValue, overrideContext);
      this.viewSlot.add(this.view);
    } else {
      this.view.bind(newValue, overrideContext);
    }
  }

  /**
  * Unbinds With
  */
  unbind() {
    this.parentOverrideContext = null;

    if (this.view) {
      this.view.unbind();
    }
  }
}
