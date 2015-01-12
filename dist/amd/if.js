define(["exports", "aurelia-templating"], function (exports, _aureliaTemplating) {
  "use strict";

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var TemplateController = _aureliaTemplating.TemplateController;
  var Property = _aureliaTemplating.Property;
  var BoundViewFactory = _aureliaTemplating.BoundViewFactory;
  var ViewSlot = _aureliaTemplating.ViewSlot;
  var If = (function () {
    var If = function If(viewFactory, viewSlot) {
      this.viewFactory = viewFactory;
      this.viewSlot = viewSlot;
      this.showing = false;
    };

    _prototypeProperties(If, {
      annotations: {
        value: function () {
          return [new TemplateController("if"), new Property("value", "valueChanged", "if")];
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      inject: {
        value: function () {
          return [BoundViewFactory, ViewSlot];
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    }, {
      valueChanged: {
        value: function (newValue) {
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
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return If;
  })();

  exports.If = If;
});