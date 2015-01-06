define(["exports", "aurelia-templating"], function (exports, _aureliaTemplating) {
  "use strict";

  var TemplateController = _aureliaTemplating.TemplateController;
  var Property = _aureliaTemplating.Property;
  var BoundViewFactory = _aureliaTemplating.BoundViewFactory;
  var ViewSlot = _aureliaTemplating.ViewSlot;
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

  exports.If = If;
});