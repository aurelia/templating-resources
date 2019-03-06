/*eslint padded-blocks:0*/
import {useView, customElement, bindable, useShadowDOM} from 'aurelia-templating';
export function _createDynamicElement(name: string, viewUrl: string, bindableNames: string[], shouldUseShadowDOM: boolean): Function {
  @customElement(name)
  @useView(viewUrl)
  class DynamicElement {
    bind(bindingContext) {
      this.$parent = bindingContext;
    }
  }

  for (let i = 0, ii = bindableNames.length; i < ii; ++i) {
    bindable(bindableNames[i])(DynamicElement);
  }

  if (shouldUseShadowDOM) {
    useShadowDOM(DynamicElement);
  }

  return DynamicElement;
}
