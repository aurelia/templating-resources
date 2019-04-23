import 'aurelia-templating';

declare module 'aurelia-templating' {
  interface HtmlBehaviorResource {
    elementName: string | null;
    attributeName: string | null;
    htmlName: string;
    target: Function;
  }
}
