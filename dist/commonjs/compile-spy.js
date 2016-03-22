'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CompileSpy = undefined;

var _dec, _dec2, _class;

var _aureliaTemplating = require('aurelia-templating');

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaLogging = require('aurelia-logging');

var LogManager = _interopRequireWildcard(_aureliaLogging);

var _aureliaPal = require('aurelia-pal');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CompileSpy = exports.CompileSpy = (_dec = (0, _aureliaTemplating.customAttribute)('compile-spy'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaPal.DOM.Element, _aureliaTemplating.TargetInstruction), _dec(_class = _dec2(_class = function CompileSpy(element, instruction) {
  _classCallCheck(this, CompileSpy);

  LogManager.getLogger('compile-spy').info(element, instruction);
}) || _class) || _class);