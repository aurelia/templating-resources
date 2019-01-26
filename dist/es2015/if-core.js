
export let IfCore = class IfCore {
  constructor(viewFactory, viewSlot) {
    this.viewFactory = viewFactory;
    this.viewSlot = viewSlot;
    this.view = null;
    this.bindingContext = null;
    this.overrideContext = null;

    this.showing = false;
    this.cache = true;
  }

  bind(bindingContext, overrideContext) {
    this.bindingContext = bindingContext;
    this.overrideContext = overrideContext;
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
    } else {
      this.view.returnToCache();
    }

    this.view = null;
  }

  _show() {
    if (this.showing) {
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
    return this.viewSlot.add(this.view);
  }

  _hide() {
    if (!this.showing) {
      return;
    }

    this.showing = false;
    let removed = this.viewSlot.remove(this.view);

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
};