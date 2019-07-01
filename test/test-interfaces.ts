import 'aurelia-templating';

/**
 * @internal
 */
declare module 'aurelia-templating' {
  interface HtmlBehaviorResource {
    elementName: string | null;
    attributeName: string | null;
    htmlName: string;
    target: Function;
  }
}
