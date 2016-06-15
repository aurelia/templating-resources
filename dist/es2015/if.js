var _dec, _dec2, _class;

import { BoundViewFactory, ViewSlot, customAttribute, templateController } from 'aurelia-templating';
import { inject } from 'aurelia-dependency-injection';

export let If = (_dec = customAttribute('if'), _dec2 = inject(BoundViewFactory, ViewSlot), _dec(_class = templateController(_class = _dec2(_class = class If {
  constructor(viewFactory, viewSlot) {
    this.viewFactory = viewFactory;
    this.viewSlot = viewSlot;
    this.showing = false;
    this.view = null;
    this.bindingContext = null;
    this.overrideContext = null;
  }

  bind(bindingContext, overrideContext) {
    this.bindingContext = bindingContext;
    this.overrideContext = overrideContext;
    this.valueChanged(this.value);
  }

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
}) || _class) || _class) || _class);