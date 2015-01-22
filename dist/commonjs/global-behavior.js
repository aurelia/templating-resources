"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var Behavior = require("aurelia-templating").Behavior;
var GlobalBehavior = (function () {
  function GlobalBehavior(element) {
    this.element = element;
  }

  _prototypeProperties(GlobalBehavior, {
    metadata: {
      value: function metadata() {
        return Behavior.attachedBehavior("global-behavior").withOptions().and(function (x) {
          return x.dynamic();
        });
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    inject: {
      value: function inject() {
        return [Element];
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  }, {
    bind: {
      value: function bind() {
        var settings, lookup, globalObject;

        lookup = GlobalBehavior.whitelist[this.aureliaAttrName];
        if (!lookup) {
          throw new Error("Conventional global binding behavior not whitelisted for " + this.aureliaAttrName + ".");
        }

        globalObject = window[lookup];
        if (!globalObject) {
          throw new Error("Conventional global " + lookup + " was not found.");
        }

        settings = {};

        for (var key in this) {
          if (key === "aureliaAttrName" || key === "aureliaCommand" || !this.hasOwnProperty(key)) {
            continue;
          }

          settings[key] = this[key];
        }

        try {
          this.instance = globalObject(this.element)[this.aureliaCommand](settings);
        } catch (error) {
          throw new Error("Conventional global binding behavior failed.", error);
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    unbind: {
      value: function unbind() {
        if (this.instance && "destroy" in this.instance) {
          this.instance.destroy();
          this.instance = null;
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return GlobalBehavior;
})();

exports.GlobalBehavior = GlobalBehavior;


GlobalBehavior.whitelist = { jquery: "jQuery" };