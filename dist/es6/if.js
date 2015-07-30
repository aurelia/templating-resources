import {BoundViewFactory, ViewSlot, customAttribute, templateController} from 'aurelia-templating';
import {inject} from 'aurelia-dependency-injection';

/**
* Binding to conditionally include or not include template logic depending on returned result
* - value should be Boolean or will be treated as such (truthy / falsey)
*
* @class If
* @constructor
* @param {ViewFactory} viewFactory The factory used to create the view
* @param {ViewSlot} viewSlot The slot the view will be inserted in to
*/
@customAttribute('if')
@templateController
@inject(BoundViewFactory, ViewSlot)
export class If {
  constructor(viewFactory, viewSlot){
    this.viewFactory = viewFactory;
    this.viewSlot = viewSlot;
    this.showing = false;
  }

  bind(executionContext) {
    // Store parent executionContext, so we can pass it down
    this.executionContext = executionContext;
    this.valueChanged(this.value);
  }

  valueChanged(newValue){
    if (!newValue) {
      if(this.view && this.showing){
        this.viewSlot.remove(this.view);
        this.view.unbind();
      }

      this.showing = false;
      return;
    }

    if(!this.view){
      this.view = this.viewFactory.create(this.executionContext);
    }

    if (!this.showing) {
      this.showing = true;

      if(!this.view.isBound){
        this.view.bind();
      }

      this.viewSlot.add(this.view);
    }
  }
}
