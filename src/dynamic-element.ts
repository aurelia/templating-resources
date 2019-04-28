/*eslint padded-blocks:0*/
import {useView, customElement, bindable, useShadowDOM} from 'aurelia-templating';
import { getLogger } from 'aurelia-logging';

export function _createDynamicElement({ name, viewUrl, bindableNames, useShadowDOMmode }: {
  name: string,
  viewUrl: string,
  bindableNames: string[],
  useShadowDOMmode: null | '' | 'open' | 'closed'
}): Function {
  @customElement(name)
  @useView(viewUrl)
  class DynamicElement {
    $parent: any;
    bind(bindingContext) {
      this.$parent = bindingContext;
    }
  }

  for (let i = 0, ii = bindableNames.length; i < ii; ++i) {
    bindable(bindableNames[i])(DynamicElement);
  }

  switch (useShadowDOMmode) {
  case 'open':
    useShadowDOM({ mode: 'open' })(DynamicElement);
    break;

  case 'closed':
    useShadowDOM({ mode: 'closed' })(DynamicElement);
    break;

  case '':
    useShadowDOM(DynamicElement);
    break;

  case null:
    // Do not use shadow dom
    break;

  default:
    getLogger('aurelia-html-only-element')
      .warn(`Expected 'use-shadow-dom' value to be "close", "open" or "", received ${useShadowDOMmode}`);
    break;
  }

  return DynamicElement;
}
