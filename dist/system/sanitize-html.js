System.register(["aurelia-templating"], function (_export) {
  var Behavior, _prototypeProperties, _classCallCheck, SCRIPT_REGEX, SanitizeHtmlValueConverter;

  return {
    setters: [function (_aureliaTemplating) {
      Behavior = _aureliaTemplating.Behavior;
    }],
    execute: function () {
      "use strict";

      _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
      SanitizeHtmlValueConverter = _export("SanitizeHtmlValueConverter", (function () {
        function SanitizeHtmlValueConverter() {
          _classCallCheck(this, SanitizeHtmlValueConverter);

          this.sanitizer = SanitizeHtmlValueConverter.defaultSanitizer;
        }

        _prototypeProperties(SanitizeHtmlValueConverter, {
          metadata: {
            value: function metadata() {
              return Behavior.valueConverter("sanitize-html");
            },
            writable: true,
            configurable: true
          },
          defaultSanitizer: {
            value: function defaultSanitizer(untrustedMarkup) {
              return untrustedMarkup.replace(SCRIPT_REGEX, "");
            },
            writable: true,
            configurable: true
          }
        }, {
          toView: {
            value: function toView(untrustedMarkup) {
              if (untrustedMarkup === null) {
                return null;
              }

              return this.sanitizer(untrustedMarkup);
            },
            writable: true,
            configurable: true
          }
        });

        return SanitizeHtmlValueConverter;
      })());
    }
  };
});