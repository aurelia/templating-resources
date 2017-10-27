var _dec, _dec2, _class;

import { BoundViewFactory, ViewSlot, customAttribute, templateController } from 'aurelia-templating';
import { inject } from 'aurelia-dependency-injection';
import { IfCore } from './if-core';

export let Else = (_dec = customAttribute('else'), _dec2 = inject(BoundViewFactory, ViewSlot), _dec(_class = templateController(_class = _dec2(_class = class Else extends IfCore {
  constructor(viewFactory, viewSlot) {
    super(viewFactory, viewSlot);
    this._registerInIf();
  }

  bind(bindingContext, overrideContext) {
    super.bind(bindingContext, overrideContext);

    if (this.ifVm.condition) {
      this._hide();
    } else {
      this._show();
    }
  }

  _registerInIf() {
    let previous = this.viewSlot.anchor.previousSibling;
    while (previous && !previous.au) {
      previous = previous.previousSibling;
    }
    if (!previous || !previous.au.if) {
      throw new Error("Can't find matching If for Else custom attribute.");
    }
    this.ifVm = previous.au.if.viewModel;
    this.ifVm.elseVm = this;
  }
}) || _class) || _class) || _class);