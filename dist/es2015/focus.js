var _dec, _dec2, _class;

import { customAttribute } from 'aurelia-templating';
import { bindingMode } from 'aurelia-binding';
import { inject } from 'aurelia-dependency-injection';
import { TaskQueue } from 'aurelia-task-queue';
import { DOM } from 'aurelia-pal';

export let Focus = (_dec = customAttribute('focus', bindingMode.twoWay), _dec2 = inject(DOM.Element, TaskQueue), _dec(_class = _dec2(_class = class Focus {
  constructor(element, taskQueue) {
    this.element = element;
    this.taskQueue = taskQueue;
    this.isAttached = false;
    this.needsApply = false;

    this.focusListener = e => {
      this.value = true;
    };
    this.blurListener = e => {
      if (DOM.activeElement !== this.element) {
        this.value = false;
      }
    };
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
    this.element.addEventListener('focus', this.focusListener);
    this.element.addEventListener('blur', this.blurListener);
  }

  detached() {
    this.isAttached = false;
    this.element.removeEventListener('focus', this.focusListener);
    this.element.removeEventListener('blur', this.blurListener);
  }
}) || _class) || _class);