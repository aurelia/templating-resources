define(['exports', 'aurelia-templating', 'aurelia-dependency-injection'], function (exports, _aureliaTemplating, _aureliaDependencyInjection) {
  'use strict';

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

  exports.__esModule = true;

  var If = (function () {
    function If(viewFactory, viewSlot) {
      _classCallCheck(this, _If);

      this.viewFactory = viewFactory;
      this.viewSlot = viewSlot;
      this.showing = false;
    }

    var _If = If;

    _If.prototype.valueChanged = function valueChanged(newValue) {
      if (!newValue) {
        if (this.view) {
          this.viewSlot.remove(this.view);
          this.view.unbind();
        }

        this.showing = false;
        return;
      }

      if (!this.view) {
        this.view = this.viewFactory.create();
      }

      if (!this.showing) {
        this.showing = true;

        if (!this.view.bound) {
          this.view.bind();
        }

        this.viewSlot.add(this.view);
      }
    };

    If = _aureliaDependencyInjection.inject(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.ViewSlot)(If) || If;
    If = _aureliaTemplating.templateController(If) || If;
    If = _aureliaTemplating.customAttribute('if')(If) || If;
    return If;
  })();

  exports.If = If;
});