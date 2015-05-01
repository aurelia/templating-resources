import {valueConverter} from 'aurelia-binding';

var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

/**
* Default Html Sanitizer to prevent script injection
*
* @class SanitizeHtml
* @constructor
*/
@valueConverter('sanitizeHtml')
export class SanitizeHtmlValueConverter {
  static defaultSanitizer(untrustedMarkup){
    return untrustedMarkup.replace(SCRIPT_REGEX, '');
  }

  constructor() {
    this.sanitizer = SanitizeHtmlValueConverter.defaultSanitizer;
  }

  toView(untrustedMarkup){
    if(untrustedMarkup === null){
      return null;
    }

    return this.sanitizer(untrustedMarkup);
  }
}
