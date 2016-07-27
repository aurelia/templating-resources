'use strict';

System.register(['aurelia-pal'], function (_export, _context) {
  "use strict";

  var FEATURE, DOM, aureliaHideClassName, aureliaHideClass;
  function injectAureliaHideStyleAtHead() {
    DOM.injectStyles(aureliaHideClass);
  }

  _export('injectAureliaHideStyleAtHead', injectAureliaHideStyleAtHead);

  function injectAureliaHideStyleAtBoundary(domBoundary) {
    if (FEATURE.shadowDOM && domBoundary && !domBoundary.hasAureliaHideStyle) {
      domBoundary.hasAureliaHideStyle = true;
      DOM.injectStyles(aureliaHideClass, domBoundary);
    }
  }

  _export('injectAureliaHideStyleAtBoundary', injectAureliaHideStyleAtBoundary);

  return {
    setters: [function (_aureliaPal) {
      FEATURE = _aureliaPal.FEATURE;
      DOM = _aureliaPal.DOM;
    }],
    execute: function () {
      _export('aureliaHideClassName', aureliaHideClassName = 'aurelia-hide');

      _export('aureliaHideClassName', aureliaHideClassName);

      aureliaHideClass = '.' + aureliaHideClassName + ' { display:none !important; }';
    }
  };
});