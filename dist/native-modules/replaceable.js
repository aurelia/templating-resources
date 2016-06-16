var _dec, _dec2, _class;



import { inject } from 'aurelia-dependency-injection';
import { BoundViewFactory, ViewSlot, customAttribute, templateController } from 'aurelia-templating';

export var Replaceable = (_dec = customAttribute('replaceable'), _dec2 = inject(BoundViewFactory, ViewSlot), _dec(_class = templateController(_class = _dec2(_class = function () {
  function Replaceable(viewFactory, viewSlot) {
    

    this.viewFactory = viewFactory;
    this.viewSlot = viewSlot;
    this.view = null;
  }

  Replaceable.prototype.bind = function bind(bindingContext, overrideContext) {
    if (this.view === null) {
      this.view = this.viewFactory.create();
      this.viewSlot.add(this.view);
    }

    this.view.bind(bindingContext, overrideContext);
  };

  Replaceable.prototype.unbind = function unbind() {
    this.view.unbind();
  };

  return Replaceable;
}()) || _class) || _class) || _class);