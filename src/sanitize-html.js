import {valueConverter} from 'aurelia-binding';
import {inject} from 'aurelia-dependency-injection';
import {HTMLSanitizer} from './html-sanitizer';

/**
* Simple html sanitization converter to preserve whitelisted elements and attributes on a bound property containing html.
*/
@valueConverter('sanitizeHTML')
@inject(HTMLSanitizer)
export class SanitizeHTMLValueConverter {
  /**
   * Creates an instanse of the value converter.
   * @param sanitizer The html sanitizer.
   */
  constructor(sanitizer) {
    this.sanitizer = sanitizer;
  }

  /**
  * Process the provided markup that flows to the view.
  * @param untrustedMarkup The untrusted markup to be sanitized.
  */
  toView(untrustedMarkup) {
    if (untrustedMarkup === null || untrustedMarkup === undefined) {
      return null;
    }

    return this.sanitizer.sanitize(untrustedMarkup);
  }
}
