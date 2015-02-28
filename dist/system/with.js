System.register(["aurelia-templating"], function (_export) {
  var Behavior, BoundViewFactory, ViewSlot, _prototypeProperties, _classCallCheck, With;

  return {
    setters: [function (_aureliaTemplating) {
      Behavior = _aureliaTemplating.Behavior;
      BoundViewFactory = _aureliaTemplating.BoundViewFactory;
      ViewSlot = _aureliaTemplating.ViewSlot;
    }],
    execute: function () {
      "use strict";

      _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      With = _export("With", (function () {
        function With(viewFactory, viewSlot) {
          _classCallCheck(this, With);

          this.viewFactory = viewFactory;
          this.viewSlot = viewSlot;
        }

        _prototypeProperties(With, {
          metadata: {
            value: function metadata() {
              return Behavior.templateController("with").withProperty("value", "valueChanged", "with");
            },
            writable: true,
            configurable: true
          },
          inject: {
            value: function inject() {
              return [BoundViewFactory, ViewSlot];
            },
            writable: true,
            configurable: true
          }
        }, {
          valueChanged: {
            value: function valueChanged(newValue) {
              if (!this.view) {
                this.view = this.viewFactory.create(newValue);
                this.viewSlot.add(this.view);
              } else {
                this.view.bind(newValue);
              }
            },
            writable: true,
            configurable: true
          }
        });

        return With;
      })());
    }
  };
});