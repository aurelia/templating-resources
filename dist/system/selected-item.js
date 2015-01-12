System.register(["aurelia-templating"], function (_export) {
  "use strict";

  var AttachedBehavior, Property, Children, _prototypeProperties, SelectedItem;
  return {
    setters: [function (_aureliaTemplating) {
      AttachedBehavior = _aureliaTemplating.AttachedBehavior;
      Property = _aureliaTemplating.Property;
      Children = _aureliaTemplating.Children;
    }],
    execute: function () {
      _prototypeProperties = function (child, staticProps, instanceProps) {
        if (staticProps) Object.defineProperties(child, staticProps);
        if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
      };

      SelectedItem = (function () {
        var SelectedItem = function SelectedItem(element) {
          this.element = element;
          this.options = [];
          this.callback = this.selectedIndexChanged.bind(this);
        };

        _prototypeProperties(SelectedItem, {
          annotations: {
            value: function () {
              return [new AttachedBehavior("selected-item"), new Property("value", "valueChanged", "selected-item"), new Children("options", "optionsChanged", "option")];
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          inject: {
            value: function () {
              return [Element];
            },
            writable: true,
            enumerable: true,
            configurable: true
          }
        }, {
          bind: {
            value: function () {
              this.element.addEventListener("change", this.callback, false);
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          unbind: {
            value: function () {
              this.element.removeEventListener("change", this.callback);
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          valueChanged: {
            value: function (newValue) {
              this.optionsChanged();
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          selectedIndexChanged: {
            value: function () {
              var index = this.element.selectedIndex,
                  option = this.options[index];

              this.value = option ? option.model : null;
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          optionsChanged: {
            value: function (mutations) {
              var value = this.value, options = this.options, option, i, ii;

              for (i = 0, ii = options.length; i < ii; ++i) {
                option = options[i];

                if (option.model === value) {
                  if (this.element.selectedIndex !== i) {
                    this.element.selectedIndex = i;
                  }

                  return;
                }
              }

              this.element.selectedIndex = 0;
            },
            writable: true,
            enumerable: true,
            configurable: true
          }
        });

        return SelectedItem;
      })();
      _export("SelectedItem", SelectedItem);
    }
  };
});