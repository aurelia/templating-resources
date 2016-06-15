

import { useView, customElement, bindable } from 'aurelia-templating';
export function _createDynamicElement(name, viewUrl, bindableNames) {
  var _dec, _dec2, _class;

  var DynamicElement = (_dec = customElement(name), _dec2 = useView(viewUrl), _dec(_class = _dec2(_class = function () {
    function DynamicElement() {
      
    }

    DynamicElement.prototype.bind = function bind(bindingContext) {
      this.$parent = bindingContext;
    };

    return DynamicElement;
  }()) || _class) || _class);

  for (var i = 0, ii = bindableNames.length; i < ii; ++i) {
    bindable(bindableNames[i])(DynamicElement);
  }
  return DynamicElement;
}