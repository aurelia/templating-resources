import {customAttribute} from 'aurelia-templating';
import {bindingMode} from 'aurelia-binding';
import {inject} from 'aurelia-dependency-injection';
import {TaskQueue} from 'aurelia-task-queue';

@customAttribute('focus', bindingMode.twoWay)
@inject(Element, TaskQueue)
export class Focus {
  constructor(element, taskQueue) {
    this.element = element;
    this.taskQueue = taskQueue;

    this.focusListener = e => {
      this.value = true;
    };
    this.blurListener = e => {
      if (document.activeElement !== this.element) {
        this.value = false;
      }
    };
  }

  valueChanged(newValue) {
    if (newValue) {
      this.giveFocus();
    } else {
      this.element.blur();
    }
  }

  giveFocus() {
    this.taskQueue.queueMicroTask(() => {
      if (this.value) {
        this.element.focus();
      }
    });
  }

  attached() {
    this.element.addEventListener('focus', this.focusListener);
    this.element.addEventListener('blur', this.blurListener);
  }

  detached() {
    this.element.removeEventListener('focus', this.focusListener)
    this.element.removeEventListener('blur', this.blurListener);
  }
}