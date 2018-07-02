var _dec, _class;

import { customAttribute } from 'aurelia-templating';
import { bindingMode } from 'aurelia-binding';
import { TaskQueue } from 'aurelia-task-queue';
import { DOM } from 'aurelia-pal';

export let Focus = (_dec = customAttribute('focus', bindingMode.twoWay), _dec(_class = class Focus {

  static inject() {
    return [DOM.Element, TaskQueue];
  }

  constructor(element, taskQueue) {
    this.element = element;
    this.taskQueue = taskQueue;
    this.isAttached = false;
    this.needsApply = false;
  }

  valueChanged(newValue) {
    if (this.isAttached) {
      this._apply();
    } else {
      this.needsApply = true;
    }
  }

  _apply() {
    if (this.value) {
      this.taskQueue.queueMicroTask(() => {
        if (this.value) {
          this.element.focus();
        }
      });
    } else {
      this.element.blur();
    }
  }

  attached() {
    this.isAttached = true;
    if (this.needsApply) {
      this.needsApply = false;
      this._apply();
    }
    this.element.addEventListener('focus', this);
    this.element.addEventListener('blur', this);
  }

  detached() {
    this.isAttached = false;
    this.element.removeEventListener('focus', this);
    this.element.removeEventListener('blur', this);
  }

  handleEvent(e) {
    if (e.type === 'focus') {
      this.value = true;
    } else if (DOM.activeElement !== this.element) {
      this.value = false;
    }
  }
}) || _class);