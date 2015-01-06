"use strict";

var AttachedBehavior = require("aurelia-templating").AttachedBehavior;
var Property = require("aurelia-templating").Property;
var Show = function Show(element) {
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

exports.Show = Show;