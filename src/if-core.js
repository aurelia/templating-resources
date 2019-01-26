/**
* For internal use only. May change without warning.
*/
export class IfCore {
  constructor(viewFactory, viewSlot) {
    this.viewFactory = viewFactory;
    this.viewSlot = viewSlot;
    this.view = null;
    this.bindingContext = null;
    this.overrideContext = null;
    // If the child view is animated, `value` might not reflect the internal
    // state anymore, so we use `showing` for that.
    // Eventually, `showing` and `value` should be consistent.
    this.showing = false;
    this.cache = true;
  }

  bind(bindingContext, overrideContext) {
    // Store parent bindingContext, so we can pass it down
    this.bindingContext = bindingContext;
    this.overrideContext = overrideContext;
  }

  unbind() {
    if (this.view === null) {
      return;
    }

    this.view.unbind();

    // It seems to me that this code is subject to race conditions when animating.
    // For example a view could be returned to the cache and reused while it's still
    // attached to the DOM and animated.
    if (!this.viewFactory.isCaching) {
      return;
    }

    if (this.showing) {
      this.showing = false;
      this.viewSlot.remove(this.view, /*returnToCache:*/true, /*skipAnimation:*/true);
    } else {
      this.view.returnToCache();
    }

    this.view = null;
  }

  _show() {
    if (this.showing) {
      // Ensures the view is bound.
      // It might not be the case when the if was unbound but not detached, then rebound.
      // Typical case where this happens is nested ifs
      if (!this.view.isBound) {
        this.view.bind(this.bindingContext, this.overrideContext);
      }
      return;
    }

    if (this.view === null) {
      this.view = this.viewFactory.create();
    }

    if (!this.view.isBound) {
      this.view.bind(this.bindingContext, this.overrideContext);
    }

    this.showing = true;
    return this.viewSlot.add(this.view); // Promise or void
  }

  _hide() {
    if (!this.showing) {
      return;
    }

    this.showing = false;
    let removed = this.viewSlot.remove(this.view); // Promise or View

    if (removed instanceof Promise) {
      return removed.then(() => {
        this._unbindView();
      });
    }

    this._unbindView();
  }

  _unbindView() {
    const cache = this.cache === 'false' ? false : !!this.cache;
    this.view.unbind();
    if (!cache) {
      this.view = null;
    }
  }
}
