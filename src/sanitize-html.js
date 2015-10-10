import {valueConverter} from 'aurelia-binding';
import {inject} from 'aurelia-dependency-injection';

const SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

export class HTMLSanitizer {
  sanitize(input) {
    return input.replace(SCRIPT_REGEX, '');
  }
}

/**
* Default Html Sanitizer to prevent script injection
*/
@valueConverter('sanitizeHtml')
@inject(HTMLSanitizer)
export class SanitizeHtmlValueConverter {
  constructor(sanitizer) {
    this.sanitizer = sanitizer;
  }

  toView(untrustedMarkup) {
    if (untrustedMarkup === null) {
      return null;
    }

    return this.sanitizer.sanitize(untrustedMarkup);
  }
}
