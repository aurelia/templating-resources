'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._createDynamicElement = _createDynamicElement;

var _aureliaTemplating = require('aurelia-templating');

var _aureliaLogging = require('aurelia-logging');



function _createDynamicElement(_ref) {
  var _dec, _dec2, _class;

  var name = _ref.name,
      viewUrl = _ref.viewUrl,
      bindableNames = _ref.bindableNames,
      useShadowDOMmode = _ref.useShadowDOMmode;
  var DynamicElement = (_dec = (0, _aureliaTemplating.customElement)(name), _dec2 = (0, _aureliaTemplating.useView)(viewUrl), _dec(_class = _dec2(_class = function () {
    function DynamicElement() {
      
    }

    DynamicElement.prototype.bind = function bind(bindingContext) {
      this.$parent = bindingContext;
    };

    return DynamicElement;
  }()) || _class) || _class);


  for (var i = 0, ii = bindableNames.length; i < ii; ++i) {
    (0, _aureliaTemplating.bindable)(bindableNames[i])(DynamicElement);
  }

  switch (useShadowDOMmode) {
    case 'open':
      (0, _aureliaTemplating.useShadowDOM)({ mode: 'open' })(DynamicElement);
      break;

    case 'closed':
      (0, _aureliaTemplating.useShadowDOM)({ mode: 'closed' })(DynamicElement);
      break;

    case '':
      (0, _aureliaTemplating.useShadowDOM)(DynamicElement);
      break;

    case null:
      break;

    default:
      (0, _aureliaLogging.getLogger)('aurelia-html-only-element').warn('Expected \'use-shadow-dom\' value to be "close", "open" or "", received ' + useShadowDOMmode);
      break;
  }

  return DynamicElement;
}