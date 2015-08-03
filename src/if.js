import {BoundViewFactory, ViewSlot, customAttribute, templateController} from 'aurelia-templating';
import {inject} from 'aurelia-dependency-injection';
import {TaskQueue} from 'aurelia-task-queue';

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
@inject(BoundViewFactory, ViewSlot, TaskQueue)
export class If {
  constructor(viewFactory, viewSlot, taskQueue){
    this.viewFactory = viewFactory;
    this.viewSlot = viewSlot;
    this.showing = false;
    this.taskQueue = taskQueue;
  }

  bind(executionContext) {
    // Store parent executionContext, so we can pass it down
    this.executionContext = executionContext;
    this.valueChanged(this.value);
  }

  valueChanged(newValue){
    if (!newValue) {
      if(this.view && this.showing){
        this.taskQueue.queueMicroTask(() => {
          this.viewSlot.remove(this.view);
          this.view.unbind();
        });
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
