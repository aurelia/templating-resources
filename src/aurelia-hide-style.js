import {FEATURE, DOM} from 'aurelia-pal';

export const aureliaHideClassName = 'aurelia-hide';

const aureliaHideClass = `.${aureliaHideClassName} { display:none !important; }`;

export function injectAureliaHideStyleAtHead() {
  DOM.injectStyles(aureliaHideClass);
}

export function injectAureliaHideStyleAtBoundary(domBoundary) {
  if (FEATURE.shadowDOM && domBoundary && !domBoundary.hasAureliaHideStyle) {
    domBoundary.hasAureliaHideStyle = true;
    DOM.injectStyles(aureliaHideClass, domBoundary);
  }
}
