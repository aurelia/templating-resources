System.register(["aurelia-templating"], function (_export) {
  "use strict";

  var AttachedBehavior, Property, Show;
  return {
    setters: [function (_aureliaTemplating) {
      AttachedBehavior = _aureliaTemplating.AttachedBehavior;
      Property = _aureliaTemplating.Property;
    }],
    execute: function () {
      Show = function Show(element) {
        this.element = element;
        this.displayStyle = element.style.display;
      };

      Show.annotations = function () {
        return [new AttachedBehavior("show"), new Property("value", "valueChanged", "show")];
      };

      Show.inject = function () {
        return [Element];
      };

      Show.prototype.valueChanged = function (newValue) {
        if (newValue) {
          this.element.style.display = this.displayStyle || "block";
        } else {
          this.displayStyle = this.element.style.display;
          this.element.style.display = "none";
        }
      };

      _export("Show", Show);
    }
  };
});