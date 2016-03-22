define(['exports', 'aurelia-templating', 'aurelia-dependency-injection', 'aurelia-logging', 'aurelia-pal'], function (exports, _aureliaTemplating, _aureliaDependencyInjection, _aureliaLogging, _aureliaPal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.CompileSpy = undefined;

  var LogManager = _interopRequireWildcard(_aureliaLogging);

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _dec2, _class;

  var CompileSpy = exports.CompileSpy = (_dec = (0, _aureliaTemplating.customAttribute)('compile-spy'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaPal.DOM.Element, _aureliaTemplating.TargetInstruction), _dec(_class = _dec2(_class = function CompileSpy(element, instruction) {
    _classCallCheck(this, CompileSpy);

    LogManager.getLogger('compile-spy').info(element, instruction);
  }) || _class) || _class);
});