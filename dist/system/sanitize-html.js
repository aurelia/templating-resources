System.register(['aurelia-binding'], function (_export) {
  var valueConverter, _classCallCheck, _createClass, SCRIPT_REGEX, SanitizeHtmlValueConverter;

  return {
    setters: [function (_aureliaBinding) {
      valueConverter = _aureliaBinding.valueConverter;
    }],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

      SanitizeHtmlValueConverter = (function () {
        function SanitizeHtmlValueConverter() {
          _classCallCheck(this, SanitizeHtmlValueConverter);

          this.sanitizer = SanitizeHtmlValueConverter.defaultSanitizer;
        }

        _createClass(SanitizeHtmlValueConverter, [{
          key: 'toView',
          value: function toView(untrustedMarkup) {
            if (untrustedMarkup === null) {
              return null;
            }

            return this.sanitizer(untrustedMarkup);
          }
        }], [{
          key: 'defaultSanitizer',
          value: function defaultSanitizer(untrustedMarkup) {
            return untrustedMarkup.replace(SCRIPT_REGEX, '');
          }
        }]);

        _export('SanitizeHtmlValueConverter', SanitizeHtmlValueConverter = valueConverter('sanitizeHtml')(SanitizeHtmlValueConverter) || SanitizeHtmlValueConverter);

        return SanitizeHtmlValueConverter;
      })();

      _export('SanitizeHtmlValueConverter', SanitizeHtmlValueConverter);
    }
  };
});