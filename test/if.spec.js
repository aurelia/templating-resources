import './setup';
import {If} from '../src/if';
import {BoundViewFactory, ViewSlot, View} from 'aurelia-templating';
import {TaskQueue} from 'aurelia-task-queue';

describe('if', () => {
  let viewSlot, taskQueue, sut, viewFactory;

  beforeEach(() => {
    viewSlot = new ViewSlotMock();
    taskQueue = new TaskQueue();
    viewFactory = new BoundViewFactoryMock();
    sut = new If(viewFactory, viewSlot, taskQueue);
  });

  it('should remove and unbind view when showing and provided value is falsy', () => {
    let view = new ViewMock();
    sut.view = view;
    sut.showing = true;
    spyOn(viewSlot, 'remove');
    spyOn(view, 'unbind');

    sut.conditionChanged(false);
    taskQueue.flushMicroTaskQueue();

    expect(viewSlot.remove).toHaveBeenCalledWith(view);
    expect(view.unbind).toHaveBeenCalled();
    expect(sut.showing).toBe(false);
  });

  it('should correctly unbind and remove view when showing and being unbound itself', () => {
    let view = new ViewMock();
    sut.view = view;
    sut.showing = true;
    viewFactory.isCaching = true;
    spyOn(viewSlot, 'remove');
    spyOn(view, 'unbind');

    sut.unbind();
    taskQueue.flushMicroTaskQueue();

    expect(view.unbind).toHaveBeenCalled();
    expect(viewSlot.remove).toHaveBeenCalledWith(view, true, true);
    expect(sut.showing).toBe(false);
    expect(sut.view).toBeNull();
  });

  it('should correctly unbind view and return it to cache when not showing and being unbound itself', () => {
    let view = new ViewMock();
    sut.view = view;
    sut.showing = false;
    viewFactory.isCaching = true;
    spyOn(viewSlot, 'remove');
    spyOn(view, 'unbind');
    spyOn(view, 'returnToCache');

    sut.unbind();
    taskQueue.flushMicroTaskQueue();

    expect(view.unbind).toHaveBeenCalled();
    expect(viewSlot.remove).not.toHaveBeenCalled();
    expect(view.returnToCache).toHaveBeenCalled();
    expect(sut.view).toBeNull();
  });

  it('should correctly unbind view without removing it when viewFactory is caching and being unbound itself', () => {
    let view = new ViewMock();
    sut.view = view;
    sut.showing = true;
    viewFactory.isCaching = false;
    spyOn(viewSlot, 'remove');
    spyOn(view, 'unbind');
    spyOn(view, 'returnToCache');

    sut.unbind();
    taskQueue.flushMicroTaskQueue();

    expect(sut.showing).toBeTruthy();
    expect(view.unbind).toHaveBeenCalled();
    expect(viewSlot.remove).not.toHaveBeenCalled();
    expect(view.returnToCache).not.toHaveBeenCalled();
    expect(sut.view).not.toBeNull();
  });

  it('should do nothing when not showing and provided value is falsy', () => {
    let view = new ViewMock();
    sut.view = view;
    sut.showing = false;
    spyOn(viewSlot, 'remove');
    spyOn(view, 'unbind');

    sut.conditionChanged(false);
    taskQueue.flushMicroTaskQueue();

    expect(viewSlot.remove).not.toHaveBeenCalled();
    expect(view.unbind).not.toHaveBeenCalled();
    expect(sut.showing).toBe(false);
  });

  it('should create the view when provided value is truthy and has no view', () => {
    sut.view = null;

    sut.conditionChanged(true);

    expect(sut.view).toEqual(jasmine.any(ViewMock));
  });

  it('should create the view', () => {
    sut.condition = true;
    sut.view = null;
    let newView = new ViewMock();
    spyOn(viewFactory, 'create').and.callFake(() => {
      return newView;
    });
    spyOn(newView, 'bind');
    let bindingContext = 42;
    let overrideContext = 24;

    sut.bind(bindingContext, overrideContext);

    expect(viewFactory.create).toHaveBeenCalled();
    expect(newView.bind).toHaveBeenCalledWith(42, 24);
  });

  it('should rebind child-view if needed when being bound itself and condition is truthy', () => {
    sut.condition = true;
    sut.showing = true;
    sut.view = {isBound: false, bind: jasmine.createSpy('bind')};
    let bindingContext = 42;
    let overrideContext = 24;

    spyOn(sut, '_show').and.callThrough();

    sut.bind(bindingContext, overrideContext);

    expect(sut._show).toHaveBeenCalled();
    expect(sut.view.bind).toHaveBeenCalledWith(42, 24);
  });

  it('should unbind the child-view when being bound itself and condition is falsy', () => {
    sut.condition = false;
    sut.showing = true;
    sut.view = {isBound: false, unbind: jasmine.createSpy('unbind')};
    let bindingContext = 42;
    let overrideContext = 24;

    spyOn(sut, '_hide').and.callThrough();

    sut.bind(bindingContext, overrideContext);

    expect(sut._hide).toHaveBeenCalled();
    expect(sut.view.unbind).toHaveBeenCalled();
  });

  it('should show the view when provided value is truthy and currently not showing', () => {
    sut.showing = false;
    sut.view = new ViewMock();
    spyOn(viewSlot, 'add');

    sut.conditionChanged(true);

    expect(sut.showing).toBe(true);
    expect(viewSlot.add).toHaveBeenCalledWith(sut.view);
  });

  it('should bind the view if not bound', () => {
    sut.showing = false;
    let view = new ViewMock();
    sut.view = view;
    spyOn(view, 'bind');

    sut.conditionChanged(true);

    expect(view.bind).toHaveBeenCalled();
  });

  describe('during animation', () => {
    let delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    let removeWithAnimation = animationDuration => {
      return function(view) {
        return delay(animationDuration).then(() => {
          this.children = [];
        });
      };
    };

    let addWithAnimation = animationDuration => {
      return function(view) {
        return delay(animationDuration).then(() => {
          this.children.push(view);
        });
      };
    };

    beforeEach(() => {
      spyOn(viewSlot, 'remove').and.callFake(removeWithAnimation(600));
      spyOn(viewSlot, 'add').and.callFake(addWithAnimation(0));
    });

    it('should correctly handle value changes during remove animation', done => {
      sut.showing = false;
      sut.view = new ViewMock();
      sut.view.isBound = true;
      sut.viewSlot.children = [];

      sut.condition = true;
      sut.conditionChanged(true);

      delay(200).then(() => {
        sut.condition = false;
        sut.conditionChanged(false);
        return delay(400);
      }).then(() => {
        sut.condition = true;
        sut.conditionChanged(true);
        return delay(600);
      }).then(() => {
        expect(viewSlot.children.length).toEqual(1);
      })
      .then(() => done())
    });
  });
});

class ViewSlotMock {
  remove() {}
  add () {}
}

class ViewMock {
  bind() {}
  unbind() {}
  returnToCache() {}
}

class BoundViewFactoryMock {
  create() {
    return new ViewMock();
  }
}
