'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Focus = undefined;

var _dec, _dec2, _class;

var _aureliaTemplating = require('aurelia-templating');

var _aureliaBinding = require('aurelia-binding');

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaTaskQueue = require('aurelia-task-queue');

var _aureliaPal = require('aurelia-pal');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Focus = exports.Focus = (_dec = (0, _aureliaTemplating.customAttribute)('focus', _aureliaBinding.bindingMode.twoWay), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaPal.DOM.Element, _aureliaTaskQueue.TaskQueue), _dec(_class = _dec2(_class = function () {
  function Focus(element, taskQueue) {
    var _this = this;

    _classCallCheck(this, Focus);

    this.element = element;
    this.taskQueue = taskQueue;

    this.focusListener = function (e) {
      _this.value = true;
    };
    this.blurListener = function (e) {
      if (_aureliaPal.DOM.activeElement !== _this.element) {
        _this.value = false;
      }
    };
  }

  Focus.prototype.valueChanged = function valueChanged(newValue) {
    if (newValue) {
      this._giveFocus();
    } else {
      this.element.blur();
    }
  };

  Focus.prototype._giveFocus = function _giveFocus() {
    var _this2 = this;

    this.taskQueue.queueMicroTask(function () {
      if (_this2.value) {
        _this2.element.focus();
      }
    });
  };

  Focus.prototype.attached = function attached() {
    this.element.addEventListener('focus', this.focusListener);
    this.element.addEventListener('blur', this.blurListener);
  };

  Focus.prototype.detached = function detached() {
    this.element.removeEventListener('focus', this.focusListener);
    this.element.removeEventListener('blur', this.blurListener);
  };

  return Focus;
}()) || _class) || _class);