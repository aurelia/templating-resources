"use strict";

var TemplateController = require('aurelia-templating').TemplateController;
var Property = require('aurelia-templating').Property;
var BoundViewFactory = require('aurelia-templating').BoundViewFactory;
var ViewSlot = require('aurelia-templating').ViewSlot;
var If = (function () {
  var If = function If(viewFactory, viewSlot) {
    this.viewFactory = viewFactory;
    this.viewSlot = viewSlot;
    this.showing = false;
  };

  If.annotations = function () {
    return [new TemplateController("if"), new Property("value", "valueChanged", "if")];
  };

  If.inject = function () {
    return [BoundViewFactory, ViewSlot];
  };

  If.prototype.valueChanged = function (newValue) {
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

  return If;
})();

exports.If = If;