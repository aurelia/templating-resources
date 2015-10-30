import {inject} from 'aurelia-dependency-injection';
import {BoundViewFactory, ViewSlot, customAttribute, templateController} from 'aurelia-templating';
import * as LogManager from 'aurelia-logging';

@customAttribute('with')
@templateController
@inject(BoundViewFactory, ViewSlot)
export class With {
  constructor(viewFactory, viewSlot) {
    this.viewFactory = viewFactory;
    this.viewSlot = viewSlot;
    LogManager.getLogger('templating-resources').warn('The "with" behavior will be removed in the next release.');
  }

  valueChanged(newValue) {
    if (!this.view) {
      this.view = this.viewFactory.create();
      this.view.bind(newValue);
      this.viewSlot.add(this.view);
    } else {
      this.view.bind(newValue);
    }
  }
}
