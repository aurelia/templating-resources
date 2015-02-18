import {Behavior, BoundViewFactory, ViewSlot} from 'aurelia-templating';

export class With {
  static metadata(){
    return Behavior
      .templateController('with')
      .withProperty('value', 'valueChanged', 'with');
  }

  static inject() { return [BoundViewFactory, ViewSlot]; }
  constructor(viewFactory, viewSlot){
    this.viewFactory = viewFactory;
    this.viewSlot = viewSlot;
    this.view = this.viewFactory.create();
    this.viewSlot.add(this.view);
    this.view.bind(this.value);
  }

  valueChanged(newValue){

    this.view.bind(newValue);

  }
}