import {valueConverter} from 'aurelia-binding';
import {inject} from 'aurelia-dependency-injection';
import {HTMLSanitizer} from './html-sanitizer';

@valueConverter('sanitizeHTML')
@inject(HTMLSanitizer)
export class SanitizeHTMLValueConverter {
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
