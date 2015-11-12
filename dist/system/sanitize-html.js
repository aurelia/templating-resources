System.register(['aurelia-binding', 'aurelia-dependency-injection', './html-sanitizer'], function (_export) {
  'use strict';

  var valueConverter, inject, HTMLSanitizer, SanitizeHTMLValueConverter;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaBinding) {
      valueConverter = _aureliaBinding.valueConverter;
    }, function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_htmlSanitizer) {
      HTMLSanitizer = _htmlSanitizer.HTMLSanitizer;
    }],
    execute: function () {
      SanitizeHTMLValueConverter = (function () {
        function SanitizeHTMLValueConverter(sanitizer) {
          _classCallCheck(this, _SanitizeHTMLValueConverter);

          this.sanitizer = sanitizer;
        }

        SanitizeHTMLValueConverter.prototype.toView = function toView(untrustedMarkup) {
          if (untrustedMarkup === null || untrustedMarkup === undefined) {
            return null;
          }

          return this.sanitizer.sanitize(untrustedMarkup);
        };

        var _SanitizeHTMLValueConverter = SanitizeHTMLValueConverter;
        SanitizeHTMLValueConverter = inject(HTMLSanitizer)(SanitizeHTMLValueConverter) || SanitizeHTMLValueConverter;
        SanitizeHTMLValueConverter = valueConverter('sanitizeHTML')(SanitizeHTMLValueConverter) || SanitizeHTMLValueConverter;
        return SanitizeHTMLValueConverter;
      })();

      _export('SanitizeHTMLValueConverter', SanitizeHTMLValueConverter);
    }
  };
});