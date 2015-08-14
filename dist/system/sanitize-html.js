System.register(['aurelia-binding'], function (_export) {
  'use strict';

  var valueConverter, SCRIPT_REGEX, SanitizeHtmlValueConverter;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaBinding) {
      valueConverter = _aureliaBinding.valueConverter;
    }],
    execute: function () {
      SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

      SanitizeHtmlValueConverter = (function () {
        SanitizeHtmlValueConverter.defaultSanitizer = function defaultSanitizer(untrustedMarkup) {
          return untrustedMarkup.replace(SCRIPT_REGEX, '');
        };

        function SanitizeHtmlValueConverter() {
          _classCallCheck(this, _SanitizeHtmlValueConverter);

          this.sanitizer = SanitizeHtmlValueConverter.defaultSanitizer;
        }

        SanitizeHtmlValueConverter.prototype.toView = function toView(untrustedMarkup) {
          if (untrustedMarkup === null) {
            return null;
          }

          return this.sanitizer(untrustedMarkup);
        };

        var _SanitizeHtmlValueConverter = SanitizeHtmlValueConverter;
        SanitizeHtmlValueConverter = valueConverter('sanitizeHtml')(SanitizeHtmlValueConverter) || SanitizeHtmlValueConverter;
        return SanitizeHtmlValueConverter;
      })();

      _export('SanitizeHtmlValueConverter', SanitizeHtmlValueConverter);
    }
  };
});