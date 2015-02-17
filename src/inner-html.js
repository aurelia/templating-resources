import {Behavior} from 'aurelia-templating';

export class InnerHTML {
  static metadata(){
    return Behavior
    .attachedBehavior('inner-html')
    .withOptions().and( x => {
      x.withProperty('value', 'valueChanged');
      x.withProperty('sanitizer');
    });
  }

  static inject() { return [Element]; }
  constructor(element) {
    this.element = element;
    this.sanitizer = InnerHTML.defaultSanitizer;
  }

  static defaultSanitizer(text) {
    var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

    while (SCRIPT_REGEX.test(text)) {
      text = text.replace(SCRIPT_REGEX, "");
    }

    return text;
  }

  bind(bindingContext) {
    this.setElementInnerHTML(this.value);
  }

  valueChanged(text){
    this.setElementInnerHTML(text);
  }

  setElementInnerHTML(text) {
    text = this.sanitizer(text);
    this.element.innerHTML = text;
  }
}
