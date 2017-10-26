import {BoundViewFactory, ViewSlot, customAttribute, templateController} from 'aurelia-templating';
import {inject} from 'aurelia-dependency-injection';
import {IfCore} from './if-core';

@customAttribute('else')
@templateController
@inject(BoundViewFactory, ViewSlot)
export class Else extends IfCore {
  constructor(viewFactory, viewSlot) {
    super(viewFactory, viewSlot);
    this._registerInIf();
  }

  bind(bindingContext, overrideContext) {
    super.bind(bindingContext, overrideContext);
    // Render on initial
    if (this.ifVm.condition) {
      this._hide();
    } else {
      this._show();
    }
  }

  _registerInIf() {
    // We support the pattern <div if.bind="x"></div><div else></div>.
    // Obvisouly between the two, we must accepts text (spaces) and comments.
    // The `if` node is expected to be a comment anchor, because of `@templateController`.
    // To simplify the code we basically walk up to the first Aurelia predecessor,
    // so having static tags in between (no binding) would work but is not intended to be supported.
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
}
