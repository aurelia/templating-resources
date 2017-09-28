/*eslint padded-blocks:0*/
import {bindingMode} from 'aurelia-binding';
import {useView, customElement, bindable} from 'aurelia-templating';

export function _createDynamicElement(name: string, viewUrl: string, bindableNames: string[]): Function {
  @customElement(name)
  @useView(viewUrl)
  class DynamicElement {
    bind(bindingContext) {
      this.$parent = bindingContext;
    }
  }

  let parts;
  let config;
  let propertyName;
  let defaultBindingMode;
  let coerce;
  let coerceParts;

  for (let i = 0, ii = bindableNames.length; i < ii; ++i) {
    defaultBindingMode = coerce = undefined;

    parts = bindableNames[i].split('&');
    propertyName = parts[0].trim();
    if (parts.length === 2) {
      defaultBindingMode = parts[1].trim();
    }

    coerceParts = propertyName.split(':');

    if (coerceParts.length === 2) {
      propertyName = coerceParts[0].trim();
      coerce = coerceParts[1].trim();
    }

    config = {
      name: propertyName,
      defaultBindingMode: bindingMode[defaultBindingMode],
      coerce
    };

    bindable(config)(DynamicElement);
  }
  return DynamicElement;
}
