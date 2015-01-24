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
        var handler = GlobalBehavior.handlers[this.aureliaAttrName];

        if (!handler) {
          throw new Error("Conventional binding handler not found for " + this.aureliaAttrName + ".");
        }

        try {
          this.instance = handler.bind(this, this.element, this.aureliaCommand);
          this.handler = handler;
        } catch (error) {
          throw new Error("Conventional binding handler failed.", error);
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    attached: {
      value: function attached() {
        if (this.handler && "attached" in this.handler && this.instance) {
          this.handler.attached(this.instance);
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    detached: {
      value: function detached() {
        if (this.handler && "detached" in this.handler && this.instance) {
          this.handler.detached(this.instance);
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    unbind: {
      value: function unbind() {
        if (this.handler && "unbind" in this.handler && this.instance) {
          this.handler.unbind(this.instance);
          this.instance = null;
          this.handler = null;
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


GlobalBehavior.createSettingsFromBehavior = function (behavior) {
  var settings = {};

  for (var key in behavior) {
    if (key === "aureliaAttrName" || key === "aureliaCommand" || !behavior.hasOwnProperty(key)) {
      continue;
    }

    settings[key] = behavior[key];
  }

  return settings;
};

GlobalBehavior.jQueryPlugins = {};

GlobalBehavior.handlers = {
  jquery: {
    bind: function bind(behavior, element, command) {
      var settings = GlobalBehavior.createSettingsFromBehavior(behavior);
      var pluginName = GlobalBehavior.jQueryPlugins[command] || command;
      return window.jQuery(element)[pluginName](settings);
    },
    unbind: function unbind(instance) {
      if ("destroy" in instance) {
        instance.destroy();
      }
    }
  }
};