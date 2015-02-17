import {Behavior} from 'aurelia-templating';

export class InnerHTML {
  static metadata(){
    return Behavior
    .attachedBehavior('inner-html')
    .withOptions().and( x => {
      x.withProperty('sanitizer', 'sanitizerChanged');
      x.withProperty('value', 'valueChanged');
    });
  }

  static inject() { return [Element]; }
  constructor(element) {
    this.element = element;
  }

  valueChanged(text){
    if(this.sanitizer) {
      text = this.sanitizer(text);
    }
    else {
      var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

      while (SCRIPT_REGEX.test(text)) {
        text = text.replace(SCRIPT_REGEX, "");
      }
    }
    this.element.innerHTML = text;
  }

  sanitizerChanged(newSanitizer) {
    this.sanitizer = newSanitizer;
  }
}
