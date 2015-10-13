import {inject} from 'aurelia-dependency-injection';
import {BoundViewFactory, ViewSlot, customAttribute, templateController} from 'aurelia-templating';

@customAttribute('replaceable')
@templateController
@inject(BoundViewFactory, ViewSlot)
export class Replaceable {
  constructor(viewFactory, viewSlot) {
    this.viewFactory = viewFactory;
    this.viewSlot = viewSlot;
    this.needsReplacement = true;
  }

  bind() {
    if (this.needsReplacement) {
      this.needsReplacement = false;
      this.viewSlot.add(this.viewFactory.create());
    }
  }
}
