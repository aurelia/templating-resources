import {ObserverLocator} from 'aurelia-binding';
import {BoundViewFactory, TemplatingEngine, ViewSlot, ViewFactory, ModuleAnalyzer} from 'aurelia-templating';
import {Container} from 'aurelia-dependency-injection';
import {initialize} from 'aurelia-pal-browser';
import {Repeat} from '../src/repeat';
import {CollectionStrategyLocator} from '../src/collection-strategy-locator';
import {NumberStrategy} from '../src/number-strategy';
import {ViewSlotMock, BoundViewFactoryMock, CollectionStrategyMock, ViewMock, ArrayObserverMock, ViewFactoryMock} from './mocks';

describe('NumberStrategy', () => {
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
    strategy = new NumberStrategy();
    container.registerInstance(ViewSlot, viewSlot);
    container.registerInstance(BoundViewFactory, viewFactory);
    container.registerInstance(ObserverLocator, observerLocator);
    container.registerInstance(CollectionStrategyLocator, collectionStrategyLocator);
    let templatingEngine = new TemplatingEngine(container, new ModuleAnalyzer());
    repeat = templatingEngine.createViewModelForUnitTest(Repeat);
  });

  describe('processItems', () => {
    beforeEach(() => {
      repeat = new Repeat(new ViewFactoryMock(), viewSlot, new ObserverLocator());
      strategy.initialize(repeat, {});
      viewSlot.children = [];
    });

    it('should create provided number of views with correct context', () => {
      strategy.processItems(3);

      expect(viewSlot.children.length).toBe(3);

      expect(viewSlot.children[0].overrideContext.item).toBe(0);
      expect(viewSlot.children[0].overrideContext.$index).toBe(0);

      expect(viewSlot.children[1].overrideContext.item).toBe(1);
      expect(viewSlot.children[1].overrideContext.$index).toBe(1);

      expect(viewSlot.children[2].overrideContext.item).toBe(2);
      expect(viewSlot.children[2].overrideContext.$index).toBe(2);
    });

    it('should add views when number is increased', () => {
      strategy.processItems(3);
      strategy.processItems(4);

      expect(viewSlot.children.length).toBe(4);

      expect(viewSlot.children[0].overrideContext.item).toBe(0);
      expect(viewSlot.children[0].overrideContext.$index).toBe(0);

      expect(viewSlot.children[1].overrideContext.item).toBe(1);
      expect(viewSlot.children[1].overrideContext.$index).toBe(1);

      expect(viewSlot.children[2].overrideContext.item).toBe(2);
      expect(viewSlot.children[2].overrideContext.$index).toBe(2);

      expect(viewSlot.children[3].overrideContext.item).toBe(3);
      expect(viewSlot.children[3].overrideContext.$index).toBe(3);
    });

    it('should remove views when number is decreased', () => {
      strategy.processItems(4);
      strategy.processItems(2);

      expect(viewSlot.children.length).toBe(2);

      expect(viewSlot.children[0].overrideContext.item).toBe(0);
      expect(viewSlot.children[0].overrideContext.$index).toBe(0);

      expect(viewSlot.children[1].overrideContext.item).toBe(1);
      expect(viewSlot.children[1].overrideContext.$index).toBe(1);
    });

    it('should remove all view when updated value is 0', () => {
      strategy.processItems(1);
      strategy.processItems(0);

      expect(viewSlot.children.length).toBe(0);
    });

    it('should remove all view when updated value is less than 0', () => {
      strategy.processItems(5);
      strategy.processItems(-1);

      expect(viewSlot.children.length).toBe(0);
    });
  });
 });
