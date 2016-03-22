var _dec, _dec2, _class;

import { valueConverter } from 'aurelia-binding';
import { inject } from 'aurelia-dependency-injection';
import { HTMLSanitizer } from './html-sanitizer';

export let SanitizeHTMLValueConverter = (_dec = valueConverter('sanitizeHTML'), _dec2 = inject(HTMLSanitizer), _dec(_class = _dec2(_class = class SanitizeHTMLValueConverter {
  constructor(sanitizer) {
    this.sanitizer = sanitizer;
  }

  toView(untrustedMarkup) {
    if (untrustedMarkup === null || untrustedMarkup === undefined) {
      return null;
    }

    return this.sanitizer.sanitize(untrustedMarkup);
  }
}) || _class) || _class);