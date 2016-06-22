import './setup';
import {ObserverLocator, createOverrideContext} from 'aurelia-binding';
import {BoundViewFactory, ViewSlot, ViewFactory, ModuleAnalyzer, TargetInstruction, ViewResources} from 'aurelia-templating';
import {StageComponent} from 'aurelia-testing';
import {Container} from 'aurelia-dependency-injection';
import {Repeat} from '../src/repeat';
import {RepeatStrategyLocator} from '../src/repeat-strategy-locator';
import {NumberRepeatStrategy} from '../src/number-repeat-strategy';
import {ViewSlotMock, BoundViewFactoryMock, RepeatStrategyMock, ViewMock, ArrayObserverMock, ViewFactoryMock, instructionMock, viewResourcesMock} from './mocks';
import {bootstrap} from 'aurelia-bootstrapper';

describe('NumberRepeatStrategy', () => {
  let repeat, strategy, viewSlot, viewFactory, observerLocator, repeatStrategyLocator, repeatStrategyMock, component;

  beforeEach(done => {
    let container = new Container();
    viewSlot = new ViewSlotMock();
    viewFactory = new BoundViewFactoryMock();
    observerLocator = new ObserverLocator();
    repeatStrategyLocator = new RepeatStrategyLocator();
    repeatStrategyMock = new RepeatStrategyMock();
    strategy = new NumberRepeatStrategy();
    container.registerInstance(TargetInstruction, instructionMock);
    container.registerInstance(ViewResources, viewResourcesMock);
    container.registerInstance(ViewSlot, viewSlot);
    container.registerInstance(BoundViewFactory, viewFactory);
    container.registerInstance(ObserverLocator, observerLocator);
    container.registerInstance(RepeatStrategyLocator, repeatStrategyLocator);

    component = StageComponent.withResources().inView('<div repeat.for="item of items"></div>').boundTo({ items: [] })

    component.create(bootstrap).then(() => {
      repeat = component.viewModel;
      repeat.viewSlot = viewSlot;
      repeat.instruction = instructionMock;
      repeat.viewFactory = viewFactory;
      done();
    });

  });

  describe('instanceChanged', () => {
    beforeEach(() => {
      repeat = new Repeat(new ViewFactoryMock(), instructionMock, viewSlot, viewResourcesMock, new ObserverLocator());
      let bindingContext = {};
      repeat.scope = { bindingContext, overrideContext: createOverrideContext(bindingContext) };
      viewSlot.children = [];
    });

    it('should create provided number of views with correct context', () => {
      strategy.instanceChanged(repeat, 3);

      expect(viewSlot.children.length).toBe(3);

      expect(viewSlot.children[0].bindingContext.item).toBe(0);
      expect(viewSlot.children[0].overrideContext.$index).toBe(0);

      expect(viewSlot.children[1].bindingContext.item).toBe(1);
      expect(viewSlot.children[1].overrideContext.$index).toBe(1);

      expect(viewSlot.children[2].bindingContext.item).toBe(2);
      expect(viewSlot.children[2].overrideContext.$index).toBe(2);
    });

    it('should add views when number is increased', () => {
      strategy.instanceChanged(repeat, 3);
      strategy.instanceChanged(repeat, 4);

      expect(viewSlot.children.length).toBe(4);

      expect(viewSlot.children[0].bindingContext.item).toBe(0);
      expect(viewSlot.children[0].overrideContext.$index).toBe(0);

      expect(viewSlot.children[1].bindingContext.item).toBe(1);
      expect(viewSlot.children[1].overrideContext.$index).toBe(1);

      expect(viewSlot.children[2].bindingContext.item).toBe(2);
      expect(viewSlot.children[2].overrideContext.$index).toBe(2);

      expect(viewSlot.children[3].bindingContext.item).toBe(3);
      expect(viewSlot.children[3].overrideContext.$index).toBe(3);
    });

    it('should remove views when number is decreased', () => {
      strategy.instanceChanged(repeat, 4);
      strategy.instanceChanged(repeat, 2);

      expect(viewSlot.children.length).toBe(2);

      expect(viewSlot.children[0].bindingContext.item).toBe(0);
      expect(viewSlot.children[0].overrideContext.$index).toBe(0);

      expect(viewSlot.children[1].bindingContext.item).toBe(1);
      expect(viewSlot.children[1].overrideContext.$index).toBe(1);
    });

    it('should remove all view when updated value is 0', () => {
      strategy.instanceChanged(repeat, 1);
      strategy.instanceChanged(repeat, 0);

      expect(viewSlot.children.length).toBe(0);
    });

    it('should remove all view when updated value is less than 0', () => {
      strategy.instanceChanged(repeat, 5);
      strategy.instanceChanged(repeat, -1);

      expect(viewSlot.children.length).toBe(0);
    });
  });
 });
