'use strict';

exports.__esModule = true;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _aureliaTemplating = require('aurelia-templating');

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaLogging = require('aurelia-logging');

var LogManager = _interopRequireWildcard(_aureliaLogging);

var ViewSpy = (function () {
  function ViewSpy() {
    _classCallCheck(this, _ViewSpy);

    this.logger = LogManager.getLogger('view-spy');
  }

  ViewSpy.prototype.log = function log(lifecycleName, context) {
    if (!this.value || this.value.indexOf(lifecycleName) !== -1) {
      this.logger.info(lifecycleName, this.view, context);
    }
  };

  ViewSpy.prototype.created = function created(view) {
    this.view = view;
    this.log('created');
  };

  ViewSpy.prototype.bind = function bind(bindingContext) {
    this.log('bind', bindingContext);
  };

  ViewSpy.prototype.attached = function attached() {
    this.log('attached');
  };

  ViewSpy.prototype.detached = function detached() {
    this.log('detached');
  };

  ViewSpy.prototype.unbind = function unbind() {
    this.log('unbind');
  };

  var _ViewSpy = ViewSpy;
  ViewSpy = _aureliaTemplating.customAttribute('view-spy')(ViewSpy) || ViewSpy;
  return ViewSpy;
})();

exports.ViewSpy = ViewSpy;