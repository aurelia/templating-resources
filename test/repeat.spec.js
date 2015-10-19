import {Repeat} from '../src/repeat';
import {ObserverLocator, calcSplices} from 'aurelia-binding';
import {BoundViewFactory, templatingEngine, ViewSlot, ViewFactory} from 'aurelia-templating';
import {Container} from 'aurelia-dependency-injection';
import {initialize} from 'aurelia-pal-browser';

describe('repeat', () => {
  let repeat, viewSlot, viewFactory;

  beforeAll(() => {
    initialize();
  });

  beforeEach(() => {
    let container = new Container();
    viewSlot = new ViewSlotMock();
    viewFactory = new BoundViewFactoryMock();
    container.registerInstance(ViewSlot, viewSlot);
    container.registerInstance(BoundViewFactory, viewFactory);
    container.registerInstance(ObserverLocator, new ObserverLocator());
    templatingEngine.initialize(container)
    repeat = templatingEngine.createModelForUnitTest(Repeat);
  });

  describe('bind', () => {
    let view1, view2;
    beforeEach(() => {
      view1 = new ViewMock();
      view2 = new ViewMock();
      viewSlot.children = [view1, view2];
      spyOn(viewSlot, 'removeAll');
      spyOn(view1, 'unbind');
      spyOn(view2, 'unbind');
    });

    it('should remove all old views if it has old items and provided with new items', () => {
      repeat.itemsChanged = () => {};
      repeat.items = ['1', '2'];
      repeat.oldItems = ['a', 'b'];

      repeat.bind();

      expect(viewSlot.removeAll).toHaveBeenCalled();
    });

    it('should remove all old views if it has old items and no new items', () => {
      repeat.items = undefined;
      repeat.oldItems = ['a', 'b'];

      repeat.bind();

      expect(viewSlot.removeAll).toHaveBeenCalled();
    });

    it('should do nothing when bound with items is of type Number and items equal old items', () => {
      let didThrow = false;
      repeat.items = 5;
      repeat.oldItems = 5;

      try {
        repeat.bind();
      }catch(e){
        didThrow = true;
      }

      expect(didThrow).toBe(false);
    });

    it('should re-bind children on repeat re-bind (Array)', ()=> {
      view1.bindingContext = null;
      view2.bindingContext = null;
      repeat.items = ['foo', 'bar'];
      repeat.lastBoundItems = ['foo', 'bar'];
      repeat.oldItems = repeat.items;

      repeat.bind();

      expect(view1.bindingContext.$index).toEqual(0);
      expect(view1.bindingContext.item).toEqual('foo');
      expect(view2.bindingContext.$index).toEqual(1);
      expect(view2.bindingContext.item).toEqual('bar');
    });

    it('should re-bind children on repeat re-bind when items added after last bound (Array)', ()=> {
      view1.bindingContext = null;
      view2.bindingContext = null;
      let view3 = new ViewMock();
      view3.bindingContext = {};
      repeat.items = ['foo', 'bar', 'qux'];
      repeat.lastBoundItems = ['foo', 'bar'];
      repeat.oldItems = repeat.items;
      spyOn(viewFactory, 'create').and.callFake(() => {
        return view3;
      })

      repeat.bind();

      expect(view1.bindingContext.$index).toEqual(0);
      expect(view1.bindingContext.item).toEqual('foo');
      expect(view2.bindingContext.$index).toEqual(1);
      expect(view2.bindingContext.item).toEqual('bar');
      expect(view3.bindingContext.$index).toEqual(2);
    });

    it('should re-bind children on repeat re-bind when items removed after last bound (Array)', ()=> {
      view1.bindingContext = null;
      view2.bindingContext = null;
      let view3 = new ViewMock();
      view3.bindingContext = {};
      repeat.items = ['foo'];
      repeat.lastBoundItems = ['foo', 'bar'];
      repeat.oldItems = repeat.items;

      repeat.bind();

      expect(viewSlot.children.length).toBe(1);
      expect(view1.bindingContext.$index).toEqual(0);
      expect(view1.bindingContext.item).toEqual('foo');
    });
  });

  describe('unbind', () => {
    it('should release all model references', ()=> {
      let view1 = new ViewMock();
      let view2 = new ViewMock();
      viewSlot.children = [view1, view2];
      view1.bindingContext = {};
      view2.bindingContext = {};

      repeat.unbind();

      expect(view1.bindingContext).toBeNull();
      expect(view2.bindingContext).toBeNull();
    });

    it('should unsubscribe collection', () => {
      let collectionObserver = new ArrayObserverMock();
      let callContext = 'handleSplices';
      repeat.collectionObserver = collectionObserver;
      repeat.callContext = callContext;
      spyOn(collectionObserver, 'unsubscribe');

      repeat.unbind();

      expect(collectionObserver.unsubscribe).toHaveBeenCalledWith(callContext, repeat);
      expect(repeat.callContext).toBeNull();
      expect(repeat.collectionObserver).toBeNull();
    });
  });

  describe('itemsChanged', () => {
    it('should call unsubscribeCollection when has collectionObserver', () => {
      repeat.collectionObserver = {};
      spyOn(repeat, 'unsubscribeCollection');

      repeat.itemsChanged();

      expect(repeat.unsubscribeCollection).toHaveBeenCalled();
    });

    it('should remove all views when has collectionObserver', () => {
      repeat.collectionObserver = { unsubscribe: callback => {} };
      let view1 = new ViewMock();
      let view2 = new ViewMock();
      viewSlot.children = [view1, view2];
      spyOn(viewSlot, 'removeAll');

      repeat.itemsChanged();

      expect(viewSlot.removeAll).toHaveBeenCalled();
    });
  });

  describe('handleSplices', () => {
    let view1, view2, view3, items, splices;

    beforeEach(() => {
      repeat = new Repeat(viewFactory, viewSlot, new ObserverLocator());
      repeat.local = 'item';
      viewSlot.children = [];
      view1 = new ViewMock();
      view2 = new ViewMock();
      view3 = new ViewMock();
      view1.bindingContext = { item: 'foo' };
      view2.bindingContext = { item: 'qux' };
      view3.bindingContext = { item: 'bar' };
      viewSlot.children = [view1, view2, view3];
      spyOn(viewFactory, 'create').and.callFake(() => {});
    });

    it('should update binding context after views are unbinded', () => {
      items = ['foo', 'qux', 'bar'];
      splices = [{
        addedCount: 0,
        index: 1,
        removed: ['qux']
      }];
      spyOn(viewSlot, 'removeAt').and.callFake(() => { return new ViewMock();});
      repeat.handleSplices(items, splices);

      expect(viewSlot.children[0].bindingContext.$index).toBe(0);
      expect(viewSlot.children[1].bindingContext.$index).toBe(1);
      expect(viewSlot.children[2].bindingContext.$index).toBe(2);
    });

    it('should update binding context after views are animated and unbinded', done => {
      items = ['foo', 'bar'];
      let rmPromises = [];
      let view = new ViewMock();
      let removeAction = () => {
        viewSlot.children.splice(1, 1);
        return view;
      };
      let animationPromise = new Promise(resolve => { resolve() }).then(() => removeAction());
      rmPromises.push(animationPromise);
      splices = [{
        addedCount: 0,
        index: 1,
        removed: ['qux']
      }];

      spyOn(viewSlot, 'removeAt').and.callFake(() => { return animationPromise });

      repeat.handleSplices(items, splices);

      Promise.all(rmPromises).then(() => {
        expect(viewSlot.children.length).toBe(2);

        expect(viewSlot.children[0].bindingContext.$index).toBe(0);
        expect(viewSlot.children[0].bindingContext.item).toBe('foo');

        expect(viewSlot.children[1].bindingContext.$index).toBe(1);
        expect(viewSlot.children[1].bindingContext.item).toBe('bar');
        done();
      });
    });

    it('should correctly handle adding item (i.e Array.prototype.push())', () => {
      repeat = new Repeat(new ViewFactoryMock(), viewSlot, new ObserverLocator());
      splices = [{
        addedCount: 1,
        index: 3,
        removed: []
      }];
      items = ['foo', 'qux', 'bar', 'norf'];
      spyOn(viewSlot, 'removeAt').and.callFake(() => { return new ViewMock();});
      repeat.handleSplices(items, splices);

      expect(viewSlot.children.length).toBe(4);
      expect(viewSlot.children[3].bindingContext.item).toBe('norf');
      expect(viewSlot.children[3].bindingContext.$index).toBe(3);
      expect(viewSlot.children[3].bindingContext.$first).toBe(false);
      expect(viewSlot.children[3].bindingContext.$last).toBe(true);
    });

    it('should correctly handle adding and removing (i.e Array.prototype.splice())', () => {
      let view4 = new ViewMock();
      view4.bindingContext = { item: 'norf' };
      let viewSlotMock = new ViewSlotMock();
      viewSlotMock.children = [view1, view2, view3, view4];
      repeat = new Repeat(new ViewFactoryMock(), viewSlotMock, new ObserverLocator());

      splices = [{
        addedCount: 1,
        index: 0,
        removed: ['foo', 'qux', 'bar']
      }];
      items = ['bar_updated', 'norf'];
      repeat.handleSplices(items, splices);

      expect(viewSlotMock.children.length).toBe(2);
      expect(viewSlotMock.children[0].bindingContext.item).toBe('bar_updated');
      expect(viewSlotMock.children[1].bindingContext.item).toBe('norf');
    });

    it('should correctly handle multiple splices adding and removing (i.e Array.prototype.reverse())', () => {
      let view4 = new ViewMock();
      view4.bindingContext = { item: 'norf' };
      let viewSlotMock = new ViewSlotMock();
      viewSlotMock.children = [view1, view2, view3, view4];
      repeat = new Repeat(new ViewFactoryMock(), viewSlotMock, new ObserverLocator());

      splices = [{
        addedCount: 2,
        index: 0,
        removed: ['foo']
      },{
        addedCount: 1,
        index: 3,
        removed: ['bar', 'norf']
      }];
      items = ['norf', 'bar', 'qux', 'foo'];
      repeat.handleSplices(items, splices);

      expect(viewSlotMock.children.length).toBe(4);
      expect(viewSlotMock.children[0].bindingContext.item).toBe('norf');
      expect(viewSlotMock.children[1].bindingContext.item).toBe('bar');
      expect(viewSlotMock.children[2].bindingContext.item).toBe('qux');
      expect(viewSlotMock.children[3].bindingContext.item).toBe('foo');

      expect(viewSlotMock.children[0].bindingContext.$index).toBe(0);
      expect(viewSlotMock.children[1].bindingContext.$index).toBe(1);
      expect(viewSlotMock.children[2].bindingContext.$index).toBe(2);
      expect(viewSlotMock.children[3].bindingContext.$index).toBe(3);
    });

    it('moving animated item', done => {
      let viewSlotMock = new ViewSlotMock();
      viewSlotMock.children = [view1, view2, view3];
      repeat = new Repeat(new ViewFactoryMock(), viewSlotMock, new ObserverLocator());
      let removeAction = () => {
        viewSlot.children.splice(2, 1);
        return view2;
      };
      let animationPromise = new Promise(resolve => { resolve() }).then(() => removeAction());
      splices = [{
        addedCount: 1,
        index: 0,
        removed: []
      },{
        addedCount: 0,
        index: 2,
        removed: ['qux']
      }];

      spyOn(viewSlot, 'removeAt').and.callFake(() => { return animationPromise });
      items = ['qux', 'foo', 'bar'];

      repeat.handleSplices(items, splices);

      animationPromise.then(() => {
        expect(viewSlotMock.children.length).toBe(3);
        expect(viewSlotMock.children[0].bindingContext.item).toBe('qux');
        expect(viewSlotMock.children[1].bindingContext.item).toBe('foo');
        expect(viewSlotMock.children[2].bindingContext.item).toBe('bar');

        expect(viewSlotMock.children[0].bindingContext.$index).toBe(0);
        expect(viewSlotMock.children[1].bindingContext.$index).toBe(1);
        expect(viewSlotMock.children[2].bindingContext.$index).toBe(2);

        done();
      });
    });

  });
  describe('processNumber', () => {
    beforeEach(() => {
      repeat = new Repeat(new ViewFactoryMock(), viewSlot, new ObserverLocator());
      viewSlot.children = [];
    });

    it('should create provided number of views with correct context', () => {
      repeat.processNumber(3);

      expect(viewSlot.children.length).toBe(3);

      expect(viewSlot.children[0].bindingContext.item).toBe(0);
      expect(viewSlot.children[0].bindingContext.$index).toBe(0);

      expect(viewSlot.children[1].bindingContext.item).toBe(1);
      expect(viewSlot.children[1].bindingContext.$index).toBe(1);

      expect(viewSlot.children[2].bindingContext.item).toBe(2);
      expect(viewSlot.children[2].bindingContext.$index).toBe(2);
    });

    it('should add views when number is increased', () => {
      repeat.processNumber(3);
      repeat.processNumber(4);

      expect(viewSlot.children.length).toBe(4);

      expect(viewSlot.children[0].bindingContext.item).toBe(0);
      expect(viewSlot.children[0].bindingContext.$index).toBe(0);

      expect(viewSlot.children[1].bindingContext.item).toBe(1);
      expect(viewSlot.children[1].bindingContext.$index).toBe(1);

      expect(viewSlot.children[2].bindingContext.item).toBe(2);
      expect(viewSlot.children[2].bindingContext.$index).toBe(2);

      expect(viewSlot.children[3].bindingContext.item).toBe(3);
      expect(viewSlot.children[3].bindingContext.$index).toBe(3);
    });

    it('should remove views when number is decreased', () => {
      repeat.processNumber(4);
      repeat.processNumber(2);

      expect(viewSlot.children.length).toBe(2);

      expect(viewSlot.children[0].bindingContext.item).toBe(0);
      expect(viewSlot.children[0].bindingContext.$index).toBe(0);

      expect(viewSlot.children[1].bindingContext.item).toBe(1);
      expect(viewSlot.children[1].bindingContext.$index).toBe(1);
    });

    it('should remove all view when updated value is 0', () => {
      repeat.processNumber(1);
      repeat.processNumber(0);

      expect(viewSlot.children.length).toBe(0);
    });

    it('should remove all view when updated value is less than 0', () => {
      repeat.processNumber(5);
      repeat.processNumber(-1);

      expect(viewSlot.children.length).toBe(0);
    });
  });
});

class ViewSlotMock {
  constructor() {
    this.children = [];
  }
  removeAll(){}
  add(view){
    this.children.push(view);
  }
  insert(index, view){
    this.children.splice(index, 0, view);
  }
  removeAt(index){
    if(index < 0) {
      throw "negative index";
    }
    this.children.splice(index, 1);
  }
}

class ViewMock {
  bind(){}
  attached(){}
  detached(){}
  unbind(){}
  returnToCache(){}
}

class BoundViewFactoryMock {
  create(){};
  removeAll(){};
}

class ViewFactoryMock {
  create(context){
    let view = new ViewMock();
    view.bindingContext = context;
    return view;
  }
}

class ArrayObserverMock {
  subscribe(){};
  unsubscribe(){};
}
