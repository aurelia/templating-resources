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
