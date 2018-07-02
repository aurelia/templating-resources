'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Focus = undefined;

var _dec, _class;

var _aureliaTemplating = require('aurelia-templating');

var _aureliaBinding = require('aurelia-binding');

var _aureliaTaskQueue = require('aurelia-task-queue');

var _aureliaPal = require('aurelia-pal');



var Focus = exports.Focus = (_dec = (0, _aureliaTemplating.customAttribute)('focus', _aureliaBinding.bindingMode.twoWay), _dec(_class = function () {
  Focus.inject = function inject() {
    return [_aureliaPal.DOM.Element, _aureliaTaskQueue.TaskQueue];
  };

  function Focus(element, taskQueue) {
    

    this.element = element;
    this.taskQueue = taskQueue;
    this.isAttached = false;
    this.needsApply = false;
  }

  Focus.prototype.valueChanged = function valueChanged(newValue) {
    if (this.isAttached) {
      this._apply();
    } else {
      this.needsApply = true;
    }
  };

  Focus.prototype._apply = function _apply() {
    var _this = this;

    if (this.value) {
      this.taskQueue.queueMicroTask(function () {
        if (_this.value) {
          _this.element.focus();
        }
      });
    } else {
      this.element.blur();
    }
  };

  Focus.prototype.attached = function attached() {
    this.isAttached = true;
    if (this.needsApply) {
      this.needsApply = false;
      this._apply();
    }
    this.element.addEventListener('focus', this);
    this.element.addEventListener('blur', this);
  };

  Focus.prototype.detached = function detached() {
    this.isAttached = false;
    this.element.removeEventListener('focus', this);
    this.element.removeEventListener('blur', this);
  };

  Focus.prototype.handleEvent = function handleEvent(e) {
    if (e.type === 'focus') {
      this.value = true;
    } else if (_aureliaPal.DOM.activeElement !== this.element) {
      this.value = false;
    }
  };

  return Focus;
}()) || _class);