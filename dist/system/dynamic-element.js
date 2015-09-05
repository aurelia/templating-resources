System.register(['aurelia-templating'], function (_export) {
  'use strict';

  var useView, customElement, bindable;

  _export('_createDynamicElement', _createDynamicElement);

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _createDynamicElement(name, viewUrl, bindableNames) {
    var DynamicElement = (function () {
      function DynamicElement() {
        _classCallCheck(this, _DynamicElement);
      }

      DynamicElement.prototype.bind = function bind(bindingContext) {
        this.$parent = bindingContext;
      };

      var _DynamicElement = DynamicElement;
      DynamicElement = useView(viewUrl)(DynamicElement) || DynamicElement;
      DynamicElement = customElement(name)(DynamicElement) || DynamicElement;
      return DynamicElement;
    })();

    for (var i = 0, ii = bindableNames.length; i < ii; ++i) {
      bindable(bindableNames[i])(DynamicElement);
    }
    return DynamicElement;
  }

  return {
    setters: [function (_aureliaTemplating) {
      useView = _aureliaTemplating.useView;
      customElement = _aureliaTemplating.customElement;
      bindable = _aureliaTemplating.bindable;
    }],
    execute: function () {}
  };
});