import {FEATURE, DOM} from 'aurelia-pal';

export const aureliaHideClassName = 'aurelia-hide';
let aureliaHideClass = `.${aureliaHideClassName} { display:none !important; }`;

export class AureliaHideStyle {
  private className: string = aureliaHideClassName;

  private static me: AureliaHideStyle = undefined;
  static instance(): AureliaHideStyle {
    if (AureliaHideStyle.me === undefined) {
      AureliaHideStyle.me = new AureliaHideStyle();
    }
    return AureliaHideStyle.me;
  }

  private constructor() {}

  class(): string {
    return this.className;
  }

  override(cssClass: string) {
    this.className = cssClass;
  }
}

export function injectAureliaHideStyleAtHead() {
  DOM.injectStyles(aureliaHideClass);
}

export function injectAureliaHideStyleAtBoundary(domBoundary: any) {
  if (FEATURE.shadowDOM && domBoundary && !domBoundary.hasAureliaHideStyle) {
    domBoundary.hasAureliaHideStyle = true;
    DOM.injectStyles(aureliaHideClass, domBoundary);
  }
}
