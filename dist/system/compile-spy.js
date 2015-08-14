System.register(['aurelia-templating', 'aurelia-dependency-injection', 'aurelia-logging'], function (_export) {
  'use strict';

  var customAttribute, TargetInstruction, inject, LogManager, CompileSpy;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaTemplating) {
      customAttribute = _aureliaTemplating.customAttribute;
      TargetInstruction = _aureliaTemplating.TargetInstruction;
    }, function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_aureliaLogging) {
      LogManager = _aureliaLogging;
    }],
    execute: function () {
      CompileSpy = (function () {
        function CompileSpy(element, instruction) {
          _classCallCheck(this, _CompileSpy);

          LogManager.getLogger('compile-spy').info(element, instruction);
        }

        var _CompileSpy = CompileSpy;
        CompileSpy = inject(Element, TargetInstruction)(CompileSpy) || CompileSpy;
        CompileSpy = customAttribute('compile-spy')(CompileSpy) || CompileSpy;
        return CompileSpy;
      })();

      _export('CompileSpy', CompileSpy);
    }
  };
});