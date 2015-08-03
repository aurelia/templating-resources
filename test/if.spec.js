import {If} from '../src/if';
import {BoundViewFactory, ViewSlot, View} from 'aurelia-templating';
import {TaskQueue} from 'aurelia-task-queue';

describe('if', () => {
  it('should remove and unbind view when showing and value is falsy', () => {
    let viewSlot = new ViewSlotMock();
    let taskQueue = new TaskQueue();
    let ifAttribute = new If(new BoundViewFactory(), viewSlot, taskQueue);
    ifAttribute.showing = true;
    let view = new ViewMock();
    ifAttribute.view = view;
    spyOn(viewSlot, 'remove');
    spyOn(view, 'unbind');

    ifAttribute.bind();
    taskQueue.flushMicroTaskQueue();

    expect(viewSlot.remove).toHaveBeenCalledWith(view);
    expect(view.unbind).toHaveBeenCalled();
    expect(ifAttribute.showing).toBe(false);
  });
});

class ViewSlotMock {
  remove() {}
}

class ViewMock {
  unbind() {}
}
