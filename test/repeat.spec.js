import {ObserverLocator} from 'aurelia-binding';
import {BoundViewFactory, TemplatingEngine, ViewSlot, ViewFactory, ModuleAnalyzer} from 'aurelia-templating';
import {Container} from 'aurelia-dependency-injection';
import {initialize} from 'aurelia-pal-browser';
import {Repeat} from '../src/repeat';
import {CollectionStrategyLocator} from '../src/collection-strategy-locator';
import {ViewSlotMock, BoundViewFactoryMock, CollectionStrategyMock, ViewMock, ArrayObserverMock} from './mocks';

describe('repeat', () => {
  let repeat, viewSlot, viewFactory, observerLocator, collectionStrategyLocator, collectionStrategyMock;

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
    container.registerInstance(ViewSlot, viewSlot);
    container.registerInstance(BoundViewFactory, viewFactory);
    container.registerInstance(ObserverLocator, observerLocator);
    container.registerInstance(CollectionStrategyLocator, collectionStrategyLocator);
    let templatingEngine = new TemplatingEngine(container, new ModuleAnalyzer());
    repeat = templatingEngine.createModelForUnitTest(Repeat);
  });

  describe('bind', () => {
    let view1, view2;
    beforeEach(() => {
      view1 = new ViewMock();
      view2 = new ViewMock();
      viewSlot.children = [view1, view2];
      spyOn(collectionStrategyLocator, 'getStrategy').and.callFake(() => { return collectionStrategyMock});
    });

    it('should do nothing if no items provided', () => {
      let didThrow = false;
      repeat.items = undefined;

      try {
        repeat.bind();
      } catch (e) {
        didThrow = true;
      }

      expect(didThrow).toBe(false);
    });

    it('should locate collection strategy', () => {
      let items = ['foo', 'bar'];
      repeat.items = items;
      repeat.bind();

      expect(collectionStrategyLocator.getStrategy).toHaveBeenCalledWith(items);
    });

    it('should initialize the collection strategy', () => {
      let items = ['foo', 'bar'];
      let bindingContext = { foo: 'bar' }
      let overrideContext = { bar: 'foo' }
      repeat.items = items;
      spyOn(collectionStrategyMock, 'initialize');

      repeat.bind(bindingContext, overrideContext);

      expect(collectionStrategyMock.initialize).toHaveBeenCalledWith(repeat, bindingContext, overrideContext);
    });

    it('should subscribe to changes', () => {
      repeat.items = ['foo', 'bar'];
      let collectionObserver = new ArrayObserverMock();
      spyOn(collectionStrategyMock, 'getCollectionObserver').and.callFake(() => { return collectionObserver });
      spyOn(collectionObserver, 'subscribe');
      repeat.bind();

      expect(collectionObserver.subscribe).toHaveBeenCalledWith(repeat.callContext, repeat);
    });
  });

  describe('unbind', () => {
    beforeEach(() => {
      repeat.collectionStrategy = collectionStrategyMock;
    });

    it('should remove all views', () => {
      spyOn(collectionStrategyMock, 'dispose').and.callFake(() => {});
      spyOn(viewSlot, 'removeAll');
      repeat.unbind();

      expect(viewSlot.removeAll).toHaveBeenCalledWith(true);
    });

    it('should unsubscribe collection', () => {
      let collectionObserver = new ArrayObserverMock();
      let callContext = 'handleSplices';
      repeat.collectionObserver = collectionObserver;
      repeat.callContext = callContext;
      spyOn(collectionObserver, 'unsubscribe');

      repeat.unbind();

      expect(collectionObserver.unsubscribe).toHaveBeenCalledWith(callContext, repeat);
    });

    it('should null out properties', () => {
      let collectionObserver = new ArrayObserverMock();
      let callContext = 'handleSplices';
      repeat.items = [];
      repeat.collectionObserver = collectionObserver;
      repeat.callContext = callContext;

      repeat.unbind();

      expect(repeat.items).toBeNull();
      expect(repeat.callContext).toBeNull();
      expect(repeat.collectionStrategy).toBeNull();
      expect(repeat.collectionObserver).toBeNull();
    });
  });

  describe('processItems', () => {
    it('should call unsubscribeCollection when has collectionObserver', () => {
      repeat.collectionObserver = {};
      spyOn(repeat, 'unsubscribeCollection');

      repeat.processItems();

      expect(repeat.unsubscribeCollection).toHaveBeenCalled();
    });

    it('should remove all views when has collectionObserver', () => {
      repeat.collectionObserver = { unsubscribe: callback => {} };
      let view1 = new ViewMock();
      let view2 = new ViewMock();
      viewSlot.children = [view1, view2];
      spyOn(viewSlot, 'removeAll');

      repeat.processItems();

      expect(viewSlot.removeAll).toHaveBeenCalled();
    });
  });
});
