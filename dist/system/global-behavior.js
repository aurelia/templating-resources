System.register(["aurelia-templating", "aurelia-logging"], function (_export) {
  var Behavior, LogManager, _prototypeProperties, _classCallCheck, GlobalBehavior;

  return {
    setters: [function (_aureliaTemplating) {
      Behavior = _aureliaTemplating.Behavior;
    }, function (_aureliaLogging) {
      LogManager = _aureliaLogging;
    }],
    execute: function () {
      "use strict";

      _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      GlobalBehavior = _export("GlobalBehavior", (function () {
        function GlobalBehavior(element) {
          _classCallCheck(this, GlobalBehavior);

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
            configurable: true
          },
          inject: {
            value: function inject() {
              return [Element];
            },
            writable: true,
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
                this.handler = handler.bind(this, this.element, this.aureliaCommand) || handler;
              } catch (error) {
                throw new Error("Conventional binding handler failed.", error);
              }
            },
            writable: true,
            configurable: true
          },
          attached: {
            value: function attached() {
              if (this.handler && "attached" in this.handler) {
                this.handler.attached(this, this.element);
              }
            },
            writable: true,
            configurable: true
          },
          detached: {
            value: function detached() {
              if (this.handler && "detached" in this.handler) {
                this.handler.detached(this, this.element);
              }
            },
            writable: true,
            configurable: true
          },
          unbind: {
            value: function unbind() {
              if (this.handler && "unbind" in this.handler) {
                this.handler.unbind(this, this.element);
              }

              this.handler = null;
            },
            writable: true,
            configurable: true
          }
        });

        return GlobalBehavior;
      })());

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
            var jqueryElement = window.jQuery(element);

            if (!jqueryElement[pluginName]) {
              LogManager.getLogger("templating-resources").warn("Could not find the jQuery plugin " + pluginName + ", possibly due to case mismatch. Trying to enumerate jQuery methods in lowercase. Add the correctly cased plugin name to the GlobalBehavior to avoid this performance hit.");

              for (var prop in jqueryElement) {
                if (prop.toLowerCase() === pluginName) {
                  pluginName = prop;
                }
              }
            }

            behavior.plugin = jqueryElement[pluginName](settings);
          },
          unbind: function unbind(behavior, element) {
            if (typeof behavior.plugin.destroy === "function") {
              behavior.plugin.destroy();
              behavior.plugin = null;
            }
          }
        }
      };
    }
  };
});