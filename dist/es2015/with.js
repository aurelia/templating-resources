var _dec, _dec2, _class;

import { inject } from 'aurelia-dependency-injection';
import { BoundViewFactory, ViewSlot, customAttribute, templateController } from 'aurelia-templating';
import { createOverrideContext } from 'aurelia-binding';

export let With = (_dec = customAttribute('with'), _dec2 = inject(BoundViewFactory, ViewSlot), _dec(_class = templateController(_class = _dec2(_class = class With {
  constructor(viewFactory, viewSlot) {
    this.viewFactory = viewFactory;
    this.viewSlot = viewSlot;
    this.parentOverrideContext = null;
    this.view = null;
  }

  bind(bindingContext, overrideContext) {
    this.parentOverrideContext = overrideContext;
    this.valueChanged(this.value);
  }

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

  unbind() {
    this.parentOverrideContext = null;

    if (this.view) {
      this.view.unbind();
    }
  }
}) || _class) || _class) || _class);