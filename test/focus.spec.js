import './setup';
import {TaskQueue} from 'aurelia-task-queue';
import {Focus} from '../src/focus';
import {DOM} from 'aurelia-pal';

describe('focus', () => {

    var focus, taskQueue, element, otherElement;

    function hasElementFocus() {
        return document.activeElement === element;
    }

    function setBindedFocusValue(value) {
        focus.value = value;
        focus.valueChanged(value);
    }
    
    beforeEach(() => {
        element = document.createElement('input');
        document.body.appendChild(element);

        otherElement = document.createElement('input');
        document.body.appendChild(otherElement);

        taskQueue = new TaskQueue();

        focus = new Focus(element, taskQueue);
    });

    it('should give initial focus when attached and value is true', () => {
        setBindedFocusValue(true);
        focus.attached();

        taskQueue.flushMicroTaskQueue();
        expect(hasElementFocus()).toBe(true);
    });

    it('should not give initial focus when attached and value is false', () => {
        focus.value = false;
        focus.attached();

        taskQueue.flushMicroTaskQueue();
        expect(hasElementFocus()).toBe(false);
    });

    it('should give focus when value is set to true', () => {
        focus.attached();

        setBindedFocusValue(true);

        taskQueue.flushMicroTaskQueue();
        expect(hasElementFocus()).toBe(true);
    });

    it('should remove focus when value is set to false', () => {
        focus.attached();
        setBindedFocusValue(true);

        setBindedFocusValue(false);

        expect(hasElementFocus()).toBe(false);
    });

    it('should set focus value to true when element gets focus', () => {
        focus.attached();
        setBindedFocusValue(false);

        element.dispatchEvent(DOM.createCustomEvent('focus'));

        expect(focus.value).toBe(true);
    });

    it('should set focus value to false when element loses focus', () => {
        focus.attached();
        setBindedFocusValue(true);

        otherElement.focus();
        element.dispatchEvent(DOM.createCustomEvent('blur'));

        expect(focus.value).toBe(false);
    });

    it('should not set focus value to true when element gets focus and behavior is detached', () => {
        focus.attached();
        focus.detached();
        setBindedFocusValue(false);

        element.dispatchEvent(DOM.createCustomEvent('focus'));

        expect(focus.value).toBe(false);
    });

    it('should not set focus value to false when element loses focus and behavior is detached', () => {
        focus.attached();
        focus.detached();
        setBindedFocusValue(true);

        element.dispatchEvent(DOM.createCustomEvent('blur'));

        expect(focus.value).toBe(true);
    });

    afterEach(() => {
        focus.detached();
        element.parentNode.removeChild(element);

        focus = null;
        element = null;
    });
});
