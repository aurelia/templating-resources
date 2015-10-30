import {inject} from 'aurelia-dependency-injection';
import {BoundViewFactory, ViewSlot, customAttribute, templateController} from 'aurelia-templating';

@customAttribute('replaceable')
@templateController
@inject(BoundViewFactory, ViewSlot)
export class Replaceable {
  constructor(viewFactory, viewSlot) {
    this.viewFactory = viewFactory;
    this.viewSlot = viewSlot;
    this.view = null;
  }

  bind(bindingContext) {
    if (this.view === null) {
      this.view = this.viewFactory.create();
      this.viewSlot.add(this.view);
    }

    this.view.bind(bindingContext);
  }
}
