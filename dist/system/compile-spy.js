'use strict';

System.register(['aurelia-templating', 'aurelia-dependency-injection', 'aurelia-logging', 'aurelia-pal'], function (_export, _context) {
  var customAttribute, TargetInstruction, inject, LogManager, DOM, _dec, _dec2, _class, CompileSpy;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_aureliaTemplating) {
      customAttribute = _aureliaTemplating.customAttribute;
      TargetInstruction = _aureliaTemplating.TargetInstruction;
    }, function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_aureliaLogging) {
      LogManager = _aureliaLogging;
    }, function (_aureliaPal) {
      DOM = _aureliaPal.DOM;
    }],
    execute: function () {
      _export('CompileSpy', CompileSpy = (_dec = customAttribute('compile-spy'), _dec2 = inject(DOM.Element, TargetInstruction), _dec(_class = _dec2(_class = function CompileSpy(element, instruction) {
        _classCallCheck(this, CompileSpy);

        LogManager.getLogger('compile-spy').info(element, instruction);
      }) || _class) || _class));

      _export('CompileSpy', CompileSpy);
    }
  };
});