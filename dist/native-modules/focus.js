var _dec, _class;



import { customAttribute } from 'aurelia-templating';
import { bindingMode } from 'aurelia-binding';
import { TaskQueue } from 'aurelia-task-queue';
import { DOM } from 'aurelia-pal';

export var Focus = (_dec = customAttribute('focus', bindingMode.twoWay), _dec(_class = function () {
  Focus.inject = function inject() {
    return [DOM.Element, TaskQueue];
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
    } else if (DOM.activeElement !== this.element) {
      this.value = false;
    }
  };

  return Focus;
}()) || _class);