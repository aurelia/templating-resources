import {ObserverLocator} from 'aurelia-binding';
import {BoundViewFactory, TemplatingEngine, ViewSlot, ViewFactory, ModuleAnalyzer} from 'aurelia-templating';
import {Container} from 'aurelia-dependency-injection';
import {initialize} from 'aurelia-pal-browser';
import {Repeat} from '../src/repeat';
import {CollectionStrategyLocator} from '../src/collection-strategy-locator';
import {ArrayCollectionStrategy} from '../src/array-collection-strategy';
import {ViewSlotMock, BoundViewFactoryMock, CollectionStrategyMock, ViewMock, ArrayObserverMock, ViewFactoryMock} from './mocks';

describe('ArrayCollectionStrategy', () => {
  let repeat, strategy, viewSlot, viewFactory, observerLocator, collectionStrategyLocator, collectionStrategyMock;

  beforeAll(() => {
    initialize();
  });

  beforeEach(() => {
    let container = new Container();
    viewSlot = new ViewSlotMock();
    viewFactory = new BoundViewFactoryMock();
    observerLocator = new ObserverLocator();
    collectionStrategyLocator = new CollectionStrategyLocator();
    collectionStrategyMock = new CollectionStrategyMock();
    strategy = new ArrayCollectionStrategy();
    container.registerInstance(ViewSlot, viewSlot);
    container.registerInstance(BoundViewFactory, viewFactory);
    container.registerInstance(ObserverLocator, observerLocator);
    container.registerInstance(CollectionStrategyLocator, collectionStrategyLocator);
    let templatingEngine = new TemplatingEngine(container, new ModuleAnalyzer());
    repeat = templatingEngine.createViewModelForUnitTest(Repeat);
  });

  describe('handleChanges', () => {
    let view1, view2, view3, items, splices;

    beforeEach(() => {
      strategy = new ArrayCollectionStrategy(new ObserverLocator());
      strategy.initialize(repeat, {});
      viewSlot.children = [];
      view1 = new ViewMock();
      view2 = new ViewMock();
      view3 = new ViewMock();
      view1.overrideContext = { item: 'foo' };
      view2.overrideContext = { item: 'qux' };
      view3.overrideContext = { item: 'bar' };
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
      strategy.handleChanges(items, splices);

      expect(viewSlot.children[0].overrideContext.$index).toBe(0);
      expect(viewSlot.children[1].overrideContext.$index).toBe(1);
      expect(viewSlot.children[2].overrideContext.$index).toBe(2);
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

      strategy.handleChanges(items, splices);

      Promise.all(rmPromises).then(() => {
        expect(viewSlot.children.length).toBe(2);

        expect(viewSlot.children[0].overrideContext.$index).toBe(0);
        expect(viewSlot.children[0].overrideContext.item).toBe('foo');

        expect(viewSlot.children[1].overrideContext.$index).toBe(1);
        expect(viewSlot.children[1].overrideContext.item).toBe('bar');
        done();
      });
    });

    it('should correctly handle adding item (i.e Array.prototype.push())', () => {
      repeat = new Repeat(new ViewFactoryMock(), viewSlot, new ObserverLocator());
      strategy.initialize(repeat, {});
      splices = [{
        addedCount: 1,
        index: 3,
        removed: []
      }];
      items = ['foo', 'qux', 'bar', 'norf'];
      spyOn(viewSlot, 'removeAt').and.callFake(() => { return new ViewMock();});
      strategy.handleChanges(items, splices);

      expect(viewSlot.children.length).toBe(4);
      expect(viewSlot.children[3].overrideContext.item).toBe('norf');
      expect(viewSlot.children[3].overrideContext.$index).toBe(3);
      expect(viewSlot.children[3].overrideContext.$first).toBe(false);
      expect(viewSlot.children[3].overrideContext.$last).toBe(true);
    });

    it('should correctly handle adding and removing (i.e Array.prototype.splice())', () => {
      let view4 = new ViewMock();
      view4.overrideContext = { item: 'norf' };
      let viewSlotMock = new ViewSlotMock();
      viewSlotMock.children = [view1, view2, view3, view4];
      repeat = new Repeat(new ViewFactoryMock(), viewSlotMock, new ObserverLocator());
      strategy.initialize(repeat, {});
      splices = [{
        addedCount: 1,
        index: 0,
        removed: ['foo', 'qux', 'bar']
      }];
      items = ['bar_updated', 'norf'];
      strategy.handleChanges(items, splices);

      expect(viewSlotMock.children.length).toBe(2);
      expect(viewSlotMock.children[0].overrideContext.item).toBe('bar_updated');
      expect(viewSlotMock.children[1].overrideContext.item).toBe('norf');
    });

    it('should correctly handle multiple splices adding and removing (i.e Array.prototype.reverse())', () => {
      let view4 = new ViewMock();
      view4.overrideContext = { item: 'norf' };
      let viewSlotMock = new ViewSlotMock();
      viewSlotMock.children = [view1, view2, view3, view4];
      repeat = new Repeat(new ViewFactoryMock(), viewSlotMock, new ObserverLocator());
      strategy.initialize(repeat, {});

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
      strategy.handleChanges(items, splices);

      expect(viewSlotMock.children.length).toBe(4);
      expect(viewSlotMock.children[0].overrideContext.item).toBe('norf');
      expect(viewSlotMock.children[1].overrideContext.item).toBe('bar');
      expect(viewSlotMock.children[2].overrideContext.item).toBe('qux');
      expect(viewSlotMock.children[3].overrideContext.item).toBe('foo');

      expect(viewSlotMock.children[0].overrideContext.$index).toBe(0);
      expect(viewSlotMock.children[1].overrideContext.$index).toBe(1);
      expect(viewSlotMock.children[2].overrideContext.$index).toBe(2);
      expect(viewSlotMock.children[3].overrideContext.$index).toBe(3);
    });

    it('moving animated item', done => {
      let viewSlotMock = new ViewSlotMock();
      viewSlotMock.children = [view1, view2, view3];
      repeat = new Repeat(new ViewFactoryMock(), viewSlotMock, new ObserverLocator());
      strategy.initialize(repeat, {});
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

      strategy.handleChanges(items, splices);

      animationPromise.then(() => {
        expect(viewSlotMock.children.length).toBe(3);
        expect(viewSlotMock.children[0].overrideContext.item).toBe('qux');
        expect(viewSlotMock.children[1].overrideContext.item).toBe('foo');
        expect(viewSlotMock.children[2].overrideContext.item).toBe('bar');

        expect(viewSlotMock.children[0].overrideContext.$index).toBe(0);
        expect(viewSlotMock.children[1].overrideContext.$index).toBe(1);
        expect(viewSlotMock.children[2].overrideContext.$index).toBe(2);

        done();
      });
    });
  });
});
