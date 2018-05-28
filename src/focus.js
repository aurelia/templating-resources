import {customAttribute} from 'aurelia-templating';
import {bindingMode} from 'aurelia-binding';
import {TaskQueue} from 'aurelia-task-queue';
import {DOM} from 'aurelia-pal';

/**
* CustomAttribute that binds provided DOM element's focus attribute with a property on the viewmodel.
*/
@customAttribute('focus', bindingMode.twoWay)
export class Focus {

  static inject() {
    return [DOM.Element, TaskQueue];
  }
  /**
  * Creates an instance of Focus.
  * @paramelement Target element on where attribute is placed on.
  * @param taskQueue The TaskQueue instance.
  */
  constructor(element, taskQueue) {
    this.element = element;
    this.taskQueue = taskQueue;
    this.isAttached = false;
    this.needsApply = false;
  }

  /**
  * Invoked everytime the bound value changes.
  * @param newValue The new value.
  */
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

  /**
  * Invoked when the attribute is attached to the DOM.
  */
  attached() {
    this.isAttached = true;
    if (this.needsApply) {
      this.needsApply = false;
      this._apply();
    }
    this.element.addEventListener('focus', this);
    this.element.addEventListener('blur', this);
  }

  /**
  * Invoked when the attribute is detached from the DOM.
  */
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
}
