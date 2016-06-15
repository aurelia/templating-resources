var _dec, _dec2, _class;



import { valueConverter } from 'aurelia-binding';
import { inject } from 'aurelia-dependency-injection';
import { HTMLSanitizer } from './html-sanitizer';

export var SanitizeHTMLValueConverter = (_dec = valueConverter('sanitizeHTML'), _dec2 = inject(HTMLSanitizer), _dec(_class = _dec2(_class = function () {
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
}()) || _class) || _class);