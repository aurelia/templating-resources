
import { useView, customElement, bindable, useShadowDOM } from 'aurelia-templating';
import { getLogger } from 'aurelia-logging';

export function _createDynamicElement({ name, viewUrl, bindableNames, useShadowDOMmode }) {
  var _dec, _dec2, _class;

  let DynamicElement = (_dec = customElement(name), _dec2 = useView(viewUrl), _dec(_class = _dec2(_class = class DynamicElement {
    bind(bindingContext) {
      this.$parent = bindingContext;
    }
  }) || _class) || _class);


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
      break;

    default:
      getLogger('aurelia-html-only-element').warn(`Expected 'use-shadow-dom' value to be "close", "open" or "", received ${useShadowDOMmode}`);
      break;
  }

  return DynamicElement;
}