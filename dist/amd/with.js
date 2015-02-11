define(["exports", "aurelia-templating"], function (exports, _aureliaTemplating) {
  "use strict";

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var Behavior = _aureliaTemplating.Behavior;
  var BoundViewFactory = _aureliaTemplating.BoundViewFactory;
  var ViewSlot = _aureliaTemplating.ViewSlot;
  var With = (function () {
    function With(viewFactory, viewSlot) {
      this.viewFactory = viewFactory;
      this.viewSlot = viewSlot;
      this.context;
    }

    _prototypeProperties(With, {
      metadata: {
        value: function metadata() {
          return Behavior.templateController("with").withProperty("value", "valueChanged", "with");
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      inject: {
        value: function inject() {
          return [BoundViewFactory, ViewSlot];
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    }, {
      valueChanged: {
        value: function valueChanged(newValue) {
          if (!newValue) {
            if (this.view) {
              this.viewSlot.remove(this.view);
              this.view.unbind();
            }

            this.context = null;
            return;
          }

          if (!this.view) {
            this.view = this.viewFactory.create();
          }
          console.log(this.context);
          if (!this.context) {
            this.context = newValue;

            if (!this.view.bound) {
              this.view.bind(this.context);
            }

            this.viewSlot.add(this.view);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return With;
  })();

  exports.With = With;
});