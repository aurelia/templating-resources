import {Behavior} from 'aurelia-templating';

var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

export class SanitizeHtmlValueConverter {
  static metadata(){
    return Behavior.valueConverter('sanitize-html');
  }

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
