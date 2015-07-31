import {Repeat} from '../src/repeat';
import {ObserverLocator} from 'aurelia-binding';
import {BoundViewFactory, BehaviorInstance, ViewSlot, ViewFactory} from 'aurelia-templating';
import {Container} from 'aurelia-dependency-injection';

describe('repeat', () => {
  let repeat, viewSlot, viewFactory;

  beforeEach(() => {
    let container = new Container();
    viewSlot = new ViewSlotMock();
    viewFactory = new BoundViewFactoryMock();
    container.registerInstance(ViewSlot, viewSlot);
    container.registerInstance(BoundViewFactory, viewFactory);
    container.registerInstance(ObserverLocator, new ObserverLocator());
    container.makeGlobal();
    repeat = BehaviorInstance.createForUnitTest(Repeat);
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

    it('should remove and unbind all old views if it has old items and provided with new items', () => {
      repeat.itemsChanged = () => {};
      repeat.items = ['1', '2'];
      repeat.oldItems = ['a', 'b'];

      repeat.bind();

      expect(viewSlot.removeAll).toHaveBeenCalled();
      expect(view1.unbind).toHaveBeenCalled();
      expect(view2.unbind).toHaveBeenCalled();
    });

    it('should remove and unbind all old views if it has old items and no new items', () => {
      repeat.items = undefined;
      repeat.oldItems = ['a', 'b'];

      repeat.bind();

      expect(viewSlot.removeAll).toHaveBeenCalled();
      expect(view1.unbind).toHaveBeenCalled();
      expect(view2.unbind).toHaveBeenCalled();
    });
  });

  describe('itemsChanged', () => {
    it('should call disposeSubscription when has disposeSubscription', () => {
      let disposeSubscription = () => {};
      repeat.disposeSubscription = disposeSubscription;
      spyOn(repeat, 'disposeSubscription');

      repeat.itemsChanged();

      expect(repeat.disposeSubscription).toHaveBeenCalled();
    });

    it('should remove all and unbind all view when has disposeSubscription', () => {
      repeat.disposeSubscription = () => {};
      let view1 = new ViewMock();
      let view2 = new ViewMock();
      viewSlot.children = [view1, view2];
      spyOn(viewSlot, 'removeAll');
      spyOn(view1, 'unbind');
      spyOn(view2, 'unbind');

      repeat.itemsChanged();

      expect(viewSlot.removeAll).toHaveBeenCalled();
      expect(view1.unbind).toHaveBeenCalled();
      expect(view2.unbind).toHaveBeenCalled();
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
      view1.executionContext = {};
      view2.executionContext = { item: 'qux' };
      view3.executionContext = {};
      viewSlot.children = [view1, view2, view3];
      spyOn(viewFactory, 'create').and.callFake(() => {});
    });

    it('should preserve full view lifecycle when re-using views', () => {
      items = ['Bar', 'Foo', 'Baz'];
      splices = [{
        addedCount: 2,
        index: 1,
        removed: ['qux']
      }];
      spyOn(view2, 'detached');
      spyOn(view2, 'bind');
      spyOn(view2, 'attached');

      repeat.handleSplices(items, splices);

      expect(view2.detached).toHaveBeenCalled();
      expect(view2.bind).toHaveBeenCalled();
      expect(view2.attached).toHaveBeenCalled();
    });

    it('should update execution context when re-using views', () => {
      items = ['Bar', 'Foo', 'Baz'];
      splices = [{
        addedCount: 2,
        index: 1,
        removed: ['qux']
      }];
      spyOn(view2, 'bind');

      repeat.handleSplices(items, splices);

      let context = { item: 'Foo',
        $parent: undefined,
        $index: 1,
        $first: false,
        $last: false,
        $middle: true,
        $odd: true,
        $even: false };
      expect(view2.bind).toHaveBeenCalledWith(context);
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

      expect(viewSlot.children[0].executionContext.item).toBe(0);
      expect(viewSlot.children[0].executionContext.$index).toBe(0);

      expect(viewSlot.children[1].executionContext.item).toBe(1);
      expect(viewSlot.children[1].executionContext.$index).toBe(1);

      expect(viewSlot.children[2].executionContext.item).toBe(2);
      expect(viewSlot.children[2].executionContext.$index).toBe(2);
    });

    it('should add views when number is increased', () => {
      repeat.processNumber(3);
      repeat.processNumber(4);

      expect(viewSlot.children.length).toBe(4);

      expect(viewSlot.children[0].executionContext.item).toBe(0);
      expect(viewSlot.children[0].executionContext.$index).toBe(0);

      expect(viewSlot.children[1].executionContext.item).toBe(1);
      expect(viewSlot.children[1].executionContext.$index).toBe(1);

      expect(viewSlot.children[2].executionContext.item).toBe(2);
      expect(viewSlot.children[2].executionContext.$index).toBe(2);

      expect(viewSlot.children[3].executionContext.item).toBe(3);
      expect(viewSlot.children[3].executionContext.$index).toBe(3);
    });

    it('should remove views when number is decreased', () => {
      repeat.processNumber(4);
      repeat.processNumber(2);

      expect(viewSlot.children.length).toBe(2);

      expect(viewSlot.children[0].executionContext.item).toBe(0);
      expect(viewSlot.children[0].executionContext.$index).toBe(0);

      expect(viewSlot.children[1].executionContext.item).toBe(1);
      expect(viewSlot.children[1].executionContext.$index).toBe(1);
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
  insert(){}
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
}

class BoundViewFactoryMock {
  create(){};
  removeAll(){};
}

class ViewFactoryMock {
  create(context){
    let view = new ViewMock();
    view.executionContext = context;
    return view;
  }
}
