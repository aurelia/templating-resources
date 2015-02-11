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
    this.context;
  }

  valueChanged(newValue){
    if (!newValue) {
      if(this.view){
        this.viewSlot.remove(this.view);
        this.view.unbind();
      }

      this.context = null;
      return;
    }

    if(!this.view){
      this.view = this.viewFactory.create();
    }
    console.log(this.context);
    if (!this.context) {
      this.context = newValue;

      if(!this.view.bound){
        this.view.bind(this.context);
      }

      this.viewSlot.add(this.view);
    }
  }
}