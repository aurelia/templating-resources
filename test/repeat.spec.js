import './setup';
import {ObserverLocator} from 'aurelia-binding';
import {BoundViewFactory, ViewSlot, ViewFactory, ModuleAnalyzer, TargetInstruction, ViewResources} from 'aurelia-templating';
import {Container} from 'aurelia-dependency-injection';
import {StageComponent} from 'aurelia-testing';
import {Repeat} from '../src/repeat';
import {RepeatStrategyLocator} from '../src/repeat-strategy-locator';
import {ViewSlotMock, BoundViewFactoryMock, RepeatStrategyMock, ViewMock, ArrayObserverMock, instructionMock, viewResourcesMock} from './mocks';
import {bootstrap} from 'aurelia-bootstrapper';

describe('repeat', () => {
  let repeat, viewSlot, viewFactory, observerLocator, repeatStrategyLocator, repeatStrategyMock, component;

  beforeEach(done => {
    let container = new Container();
    viewSlot = new ViewSlotMock();
    viewFactory = new BoundViewFactoryMock();
    observerLocator = container.get(ObserverLocator);
    repeatStrategyLocator = container.get(RepeatStrategyLocator);
    repeatStrategyMock = new RepeatStrategyMock();
    container.registerInstance(TargetInstruction, instructionMock);
    container.registerInstance(ViewResources, viewResourcesMock);
    container.registerInstance(ViewSlot, viewSlot);
    container.registerInstance(BoundViewFactory, viewFactory);

    component = StageComponent.withResources().inView('<div repeat.for="item of items"></div>').boundTo({ items: [] });

    component.create(bootstrap).then(() => {
      repeat = component.viewModel;
      repeat.viewSlot = viewSlot;
      repeat.instruction = instructionMock;
      repeat.viewFactory = viewFactory;
      repeat.observerLocator = observerLocator;
      repeat.strategyLocator = repeatStrategyLocator;
      done();
    });

  });

  describe('bind', () => {
    let view1, view2;
    beforeEach(() => {
      view1 = new ViewMock();
      view2 = new ViewMock();
      viewSlot.children = [view1, view2];
      spyOn(repeatStrategyLocator, 'getStrategy').and.callFake(() => { return repeatStrategyMock});
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
  });

  describe('unbind', () => {
    beforeEach(() => {
      repeat.collectionStrategy = repeatStrategyMock;
    });

    it('should remove all views', () => {
      spyOn(viewSlot, 'removeAll');
      repeat.unbind();

      expect(viewSlot.removeAll).toHaveBeenCalled(); //With(true, true);
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
      expect(repeat.collectionObserver).toBeNull();
    });
  });

  describe('itemsChanged', () => {
    beforeEach(() => {
      spyOn(repeatStrategyLocator, 'getStrategy').and.callFake(() => { return repeatStrategyMock});
    });

    it('should unsubscribe collection', () => {
      repeat.collectionObserver = {};
      spyOn(repeat, '_unsubscribeCollection');

      repeat.itemsChanged();

      expect(repeat._unsubscribeCollection).toHaveBeenCalled();
    });

    it('should locate collection strategy', () => {
      let items = ['foo', 'bar'];
      repeat.items = items;
      repeat.itemsChanged();

      expect(repeatStrategyLocator.getStrategy).toHaveBeenCalledWith(items);
    });

    it('should subscribe to changes', () => {
      repeat.items = ['foo', 'bar'];
      let collectionObserver = new ArrayObserverMock();
      spyOn(repeatStrategyMock, 'getCollectionObserver').and.callFake(() => { return collectionObserver });
      spyOn(collectionObserver, 'subscribe');
      repeat.itemsChanged();

      expect(collectionObserver.subscribe).toHaveBeenCalledWith(repeat.callContext, repeat);
    });
  });
});
