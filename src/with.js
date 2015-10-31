import {inject} from 'aurelia-dependency-injection';
import {BoundViewFactory, ViewSlot, customAttribute, templateController} from 'aurelia-templating';
import {createOverrideContext} from 'aurelia-binding';

@customAttribute('with')
@templateController
@inject(BoundViewFactory, ViewSlot)
export class With {
  constructor(viewFactory, viewSlot) {
    this.viewFactory = viewFactory;
    this.viewSlot = viewSlot;
    this.overrideContext = null;
    this.view = null;
  }

  bind(bindingContext, overrideContext) {
    this.overrideContext = createOverrideContext(bindingContext, overrideContext);
    this.valueChanged(this.value);
  }

  valueChanged(newValue) {
    if (!this.view) {
      this.view = this.viewFactory.create();
      this.view.bind(newValue, this.overrideContext);
      this.viewSlot.add(this.view);
    } else {
      this.view.bind(newValue, this.overrideContext);
    }
  }

  unbind() {
    this.overrideContext = null;

    if (this.view) {
      this.view.unbind();
    }
  }
}
