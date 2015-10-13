'use strict';

exports.__esModule = true;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _aureliaTemplating = require('aurelia-templating');

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaLogging = require('aurelia-logging');

var LogManager = _interopRequireWildcard(_aureliaLogging);

var _aureliaPal = require('aurelia-pal');

var CompileSpy = (function () {
  function CompileSpy(element, instruction) {
    _classCallCheck(this, _CompileSpy);

    LogManager.getLogger('compile-spy').info(element, instruction);
  }

  var _CompileSpy = CompileSpy;
  CompileSpy = _aureliaDependencyInjection.inject(_aureliaPal.DOM.Element, _aureliaTemplating.TargetInstruction)(CompileSpy) || CompileSpy;
  CompileSpy = _aureliaTemplating.customAttribute('compile-spy')(CompileSpy) || CompileSpy;
  return CompileSpy;
})();

exports.CompileSpy = CompileSpy;