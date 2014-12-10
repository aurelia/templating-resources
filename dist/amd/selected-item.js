define(["exports", "aurelia-templating"], function (exports, _aureliaTemplating) {
  "use strict";

  var AttachedBehavior = _aureliaTemplating.AttachedBehavior;
  var Property = _aureliaTemplating.Property;
  var Children = _aureliaTemplating.Children;
  var SelectedItem = (function () {
    var SelectedItem = function SelectedItem(element) {
      this.element = element;
      this.options = [];
      this.callback = this.selectedIndexChanged.bind(this);
    };

    SelectedItem.annotations = function () {
      return [new AttachedBehavior("selected-item"), new Property("value", "valueChanged", "selected-item"), new Children("options", "optionsChanged", "option")];
    };

    SelectedItem.inject = function () {
      return [Element];
    };

    SelectedItem.prototype.bind = function () {
      this.element.addEventListener("change", this.callback, false);
    };

    SelectedItem.prototype.unbind = function () {
      this.element.removeEventListener("change", this.callback);
    };

    SelectedItem.prototype.valueChanged = function (newValue) {
      this.optionsChanged();
    };

    SelectedItem.prototype.selectedIndexChanged = function () {
      var index = this.element.selectedIndex, option = this.options[index];

      this.value = option ? option.model : null;
    };

    SelectedItem.prototype.optionsChanged = function (mutations) {
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
    };

    return SelectedItem;
  })();

  exports.SelectedItem = SelectedItem;
});