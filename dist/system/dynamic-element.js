'use strict';

System.register(['aurelia-templating', 'aurelia-logging'], function (_export, _context) {
  "use strict";

  var useView, customElement, bindable, useShadowDOM, getLogger;

  

  function _createDynamicElement(_ref) {
    var _dec, _dec2, _class;

    var name = _ref.name,
        viewUrl = _ref.viewUrl,
        bindableNames = _ref.bindableNames,
        useShadowDOMmode = _ref.useShadowDOMmode;
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
        getLogger('aurelia-html-only-element').warn('Expected \'use-shadow-dom\' value to be "close", "open" or "", received ' + useShadowDOMmode);
        break;
    }

    return DynamicElement;
  }

  _export('_createDynamicElement', _createDynamicElement);

  return {
    setters: [function (_aureliaTemplating) {
      useView = _aureliaTemplating.useView;
      customElement = _aureliaTemplating.customElement;
      bindable = _aureliaTemplating.bindable;
      useShadowDOM = _aureliaTemplating.useShadowDOM;
    }, function (_aureliaLogging) {
      getLogger = _aureliaLogging.getLogger;
    }],
    execute: function () {}
  };
});