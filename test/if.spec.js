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

    sut.valueChanged(false);
    taskQueue.flushMicroTaskQueue();

    expect(viewSlot.remove).toHaveBeenCalledWith(view);
    expect(view.unbind).toHaveBeenCalled();
    expect(sut.showing).toBe(false);
  });

  it('should do nothing when not showing and provided value is falsy', () => {
    let view = new ViewMock();
    sut.view = view;
    sut.showing = false;
    spyOn(viewSlot, 'remove');
    spyOn(view, 'unbind');

    sut.valueChanged(false);
    taskQueue.flushMicroTaskQueue();

    expect(viewSlot.remove).not.toHaveBeenCalled();
    expect(view.unbind).not.toHaveBeenCalled();
    expect(sut.showing).toBe(false);
  });

  it('should do nothing when showing, provided value is falsy and has no view', () => {
    let view = new ViewMock();
    sut.view = null;
    sut.showing = true;
    spyOn(viewSlot, 'remove');
    spyOn(view, 'unbind');

    sut.valueChanged(false);
    taskQueue.flushMicroTaskQueue();

    expect(viewSlot.remove).not.toHaveBeenCalled();
    expect(view.unbind).not.toHaveBeenCalled();
    expect(sut.showing).toBe(false);
  });

  it('should create the view when provided value is truthy and has no view', () => {
    sut.view = null;

    sut.valueChanged(true);

    expect(sut.view).toEqual(jasmine.any(ViewMock));
  });

  it('should create the view', () => {
    sut.value = true;
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

  it('should show the view when provided value is truthy and currently not showing', () => {
    sut.showing = false;
    sut.view = new ViewMock();
    spyOn(viewSlot, 'add');

    sut.valueChanged(true);

    expect(sut.showing).toBe(true);
    expect(viewSlot.add).toHaveBeenCalledWith(sut.view);
  });

  it('should bind the view if not bound', () => {
    sut.showing = false;
    let view = new ViewMock();
    sut.view = view;
    spyOn(view, 'bind');

    sut.valueChanged(true);

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
      sut.valueChanged(true);        
   
      delay(200).then(() => {          
        sut.valueChanged(false);
        return delay(400);
      }).then(() => {
        sut.valueChanged(true);
        return delay(600);          
      }).then(() => {  
        expect(viewSlot.children.length).toEqual(1);
      })
      .then(() => done())
    })
  });
});

class ViewSlotMock {
  remove() {}
  add () {}
}

class ViewMock {
  bind() {}
  unbind() {}
}

class BoundViewFactoryMock {
  create() {
    return new ViewMock();
  }
}
