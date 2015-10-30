import {BoundViewFactory, ViewSlot, customAttribute, templateController} from 'aurelia-templating';
import {inject} from 'aurelia-dependency-injection';
import {TaskQueue} from 'aurelia-task-queue';

/**
* Binding to conditionally include or not include template logic depending on returned result
* - value should be Boolean or will be treated as such (truthy / falsey)
*/
@customAttribute('if')
@templateController
@inject(BoundViewFactory, ViewSlot, TaskQueue)
export class If {
  constructor(viewFactory, viewSlot, taskQueue) {
    this.viewFactory = viewFactory;
    this.viewSlot = viewSlot;
    this.showing = false;
    this.taskQueue = taskQueue;
    this.view = null;
    this.bindingContext = null;
    this.overrideContext = null;
  }

  bind(bindingContext, overrideContext) {
    // Store parent bindingContext, so we can pass it down
    this.bindingContext = bindingContext;
    this.overrideContext = overrideContext;
    this.valueChanged(this.value);
  }

  valueChanged(newValue) {
    if (!newValue) {
      if (this.view !== null && this.showing) {
        this.taskQueue.queueMicroTask(() => {
          let viewOrPromise = this.viewSlot.remove(this.view);
          if (viewOrPromise instanceof Promise) {
            viewOrPromise.then(() => this.view.unbind());
          } else {
            this.view.unbind();
          }
        });
      }

      this.showing = false;
      return;
    }

    if (this.view === null) {
      this.view = this.viewFactory.create();
    }

    if (!this.showing) {
      this.showing = true;

      if (!this.view.isBound) {
        this.view.bind(this.bindingContext, this.overrideContext);
      }

      this.viewSlot.add(this.view);
    }
  }

  unbind() {
    if (this.view !== null && this.viewFactory.isCaching) {
      if (this.showing) {
        this.showing = false;
        this.viewSlot.remove(this.view, true, true);
      } else {
        this.view.returnToCache();
      }

      this.view = null;
    }
  }
}
