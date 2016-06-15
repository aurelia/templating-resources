import {BoundViewFactory, ViewSlot, customAttribute, templateController} from 'aurelia-templating';
import {inject} from 'aurelia-dependency-injection';

/**
* Binding to conditionally include or not include template logic depending on returned result
* - value should be Boolean or will be treated as such (truthy / falsey)
*/
@customAttribute('if')
@templateController
@inject(BoundViewFactory, ViewSlot)
export class If {
  /**
  * Creates an instance of If.
  * @param {BoundViewFactory} viewFactory The factory generating the view
  * @param {ViewSlot} viewSlot The slot the view is injected in to
  */
  constructor(viewFactory, viewSlot) {
    this.viewFactory = viewFactory;
    this.viewSlot = viewSlot;
    this.showing = false;
    this.view = null;
    this.bindingContext = null;
    this.overrideContext = null;
  }

  /**
  * Binds the if to the binding context and override context
  * @param bindingContext The binding context
  * @param overrideContext An override context for binding.
  */
  bind(bindingContext, overrideContext) {
    // Store parent bindingContext, so we can pass it down
    this.bindingContext = bindingContext;
    this.overrideContext = overrideContext;
    this.valueChanged(this.value);
  }

  /**
  * Invoked everytime value property changes.
  * @param newValue The new value
  */
  valueChanged(newValue) {
    if (this.__queuedChanges) {
      this.__queuedChanges.push(newValue);
      return;
    }

    let maybePromise = this._runValueChanged(newValue);
    if (maybePromise instanceof Promise) {
      let queuedChanges = this.__queuedChanges = [];

      let runQueuedChanges = () => {
        if (!queuedChanges.length) {
          this.__queuedChanges = undefined;
          return;
        }

        let nextPromise = this._runValueChanged(queuedChanges.shift()) || Promise.resolve();
        nextPromise.then(runQueuedChanges);
      };

      maybePromise.then(runQueuedChanges);
    }
  }

  _runValueChanged(newValue) {
    if (!newValue) {
      let viewOrPromise;
      if (this.view !== null && this.showing) {
        viewOrPromise = this.viewSlot.remove(this.view);
        if (viewOrPromise instanceof Promise) {
          viewOrPromise.then(() => this.view.unbind());
        } else {
          this.view.unbind();
        }
      }

      this.showing = false;
      return viewOrPromise;
    }

    if (this.view === null) {
      this.view = this.viewFactory.create();
    }

    if (!this.view.isBound) {
      this.view.bind(this.bindingContext, this.overrideContext);
    }

    if (!this.showing) {
      this.showing = true;
      return this.viewSlot.add(this.view);
    }

    return undefined;
  }

  /**
  * Unbinds the if
  */
  unbind() {
    if (this.view === null) {
      return;
    }

    this.view.unbind();

    if (!this.viewFactory.isCaching) {
      return;
    }

    if (this.showing) {
      this.showing = false;
      this.viewSlot.remove(this.view, true, true);
    }
    this.view.returnToCache();
    this.view = null;
  }
}
