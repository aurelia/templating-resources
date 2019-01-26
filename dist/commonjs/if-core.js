'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});



var IfCore = exports.IfCore = function () {
  function IfCore(viewFactory, viewSlot) {
    

    this.viewFactory = viewFactory;
    this.viewSlot = viewSlot;
    this.view = null;
    this.bindingContext = null;
    this.overrideContext = null;

    this.showing = false;
    this.cache = true;
  }

  IfCore.prototype.bind = function bind(bindingContext, overrideContext) {
    this.bindingContext = bindingContext;
    this.overrideContext = overrideContext;
  };

  IfCore.prototype.unbind = function unbind() {
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
  };

  IfCore.prototype._show = function _show() {
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
  };

  IfCore.prototype._hide = function _hide() {
    var _this = this;

    if (!this.showing) {
      return;
    }

    this.showing = false;
    var removed = this.viewSlot.remove(this.view);

    if (removed instanceof Promise) {
      return removed.then(function () {
        _this._unbindView();
      });
    }

    this._unbindView();
  };

  IfCore.prototype._unbindView = function _unbindView() {
    var cache = this.cache === 'false' ? false : !!this.cache;
    this.view.unbind();
    if (!cache) {
      this.view = null;
    }
  };

  return IfCore;
}();