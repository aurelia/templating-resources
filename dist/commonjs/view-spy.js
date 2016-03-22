'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ViewSpy = undefined;

var _dec, _class;

var _aureliaTemplating = require('aurelia-templating');

var _aureliaLogging = require('aurelia-logging');

var LogManager = _interopRequireWildcard(_aureliaLogging);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ViewSpy = exports.ViewSpy = (_dec = (0, _aureliaTemplating.customAttribute)('view-spy'), _dec(_class = function () {
  function ViewSpy() {
    _classCallCheck(this, ViewSpy);

    this.logger = LogManager.getLogger('view-spy');
  }

  ViewSpy.prototype._log = function _log(lifecycleName, context) {
    if (!this.value && lifecycleName === 'created') {
      this.logger.info(lifecycleName, this.view);
    } else if (this.value && this.value.indexOf(lifecycleName) !== -1) {
      this.logger.info(lifecycleName, this.view, context);
    }
  };

  ViewSpy.prototype.created = function created(view) {
    this.view = view;
    this._log('created');
  };

  ViewSpy.prototype.bind = function bind(bindingContext) {
    this._log('bind', bindingContext);
  };

  ViewSpy.prototype.attached = function attached() {
    this._log('attached');
  };

  ViewSpy.prototype.detached = function detached() {
    this._log('detached');
  };

  ViewSpy.prototype.unbind = function unbind() {
    this._log('unbind');
  };

  return ViewSpy;
}()) || _class);