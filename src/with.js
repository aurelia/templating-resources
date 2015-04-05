import {inject} from 'aurelia-dependency-injection';
import {BoundViewFactory, ViewSlot, customAttribute, templateController} from 'aurelia-templating';

@customAttribute('with')
@templateController
@inject(BoundViewFactory, ViewSlot)
export class With {
  constructor(viewFactory, viewSlot){
    this.viewFactory = viewFactory;
    this.viewSlot = viewSlot;
  }

  valueChanged(newValue){
    if(!this.view){
      this.view = this.viewFactory.create(newValue);
      this.viewSlot.add(this.view);
    }else{
      this.view.bind(newValue);
    }
  }
}
