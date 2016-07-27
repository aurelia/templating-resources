'use strict';

System.register(['aurelia-templating'], function (_export, _context) {
  "use strict";

  var useView, customElement, bindable;

  

  function _createDynamicElement(name, viewUrl, bindableNames) {
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

  _export('_createDynamicElement', _createDynamicElement);

  return {
    setters: [function (_aureliaTemplating) {
      useView = _aureliaTemplating.useView;
      customElement = _aureliaTemplating.customElement;
      bindable = _aureliaTemplating.bindable;
    }],
    execute: function () {}
  };
});