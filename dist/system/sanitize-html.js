'use strict';

System.register(['aurelia-binding', 'aurelia-dependency-injection', './html-sanitizer'], function (_export, _context) {
  "use strict";

  var valueConverter, inject, HTMLSanitizer, _dec, _dec2, _class, SanitizeHTMLValueConverter;

  

  return {
    setters: [function (_aureliaBinding) {
      valueConverter = _aureliaBinding.valueConverter;
    }, function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_htmlSanitizer) {
      HTMLSanitizer = _htmlSanitizer.HTMLSanitizer;
    }],
    execute: function () {
      _export('SanitizeHTMLValueConverter', SanitizeHTMLValueConverter = (_dec = valueConverter('sanitizeHTML'), _dec2 = inject(HTMLSanitizer), _dec(_class = _dec2(_class = function () {
        function SanitizeHTMLValueConverter(sanitizer) {
          

          this.sanitizer = sanitizer;
        }

        SanitizeHTMLValueConverter.prototype.toView = function toView(untrustedMarkup) {
          if (untrustedMarkup === null || untrustedMarkup === undefined) {
            return null;
          }

          return this.sanitizer.sanitize(untrustedMarkup);
        };

        return SanitizeHTMLValueConverter;
      }()) || _class) || _class));

      _export('SanitizeHTMLValueConverter', SanitizeHTMLValueConverter);
    }
  };
});