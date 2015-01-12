"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var AttachedBehavior = require("aurelia-templating").AttachedBehavior;
var Property = require("aurelia-templating").Property;
var Show = (function () {
  var Show = function Show(element) {
    this.element = element;
    this.displayStyle = element.style.display;
  };

  _prototypeProperties(Show, {
    annotations: {
      value: function () {
        return [new AttachedBehavior("show"), new Property("value", "valueChanged", "show")];
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
    valueChanged: {
      value: function (newValue) {
        if (newValue) {
          this.element.style.display = this.displayStyle || "block";
        } else {
          this.displayStyle = this.element.style.display;
          this.element.style.display = "none";
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return Show;
})();

exports.Show = Show;