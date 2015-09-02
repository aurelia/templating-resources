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
  constructor(viewFactory, viewSlot, taskQueue) {
    this.viewFactory = viewFactory;
    this.viewSlot = viewSlot;
    this.showing = false;
    this.taskQueue = taskQueue;
    this.view = null;
    this.$parent = null;
  }

  bind(bindingContext) {
    // Store parent bindingContext, so we can pass it down
    this.$parent = bindingContext;
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
      this.view = this.viewFactory.create(this.$parent);
    }

    if (!this.showing) {
      this.showing = true;

      if (!this.view.isBound) {
        this.view.bind();
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
