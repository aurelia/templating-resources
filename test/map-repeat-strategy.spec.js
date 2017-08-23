import './setup';
import {ObserverLocator, createOverrideContext} from 'aurelia-binding';
import {StageComponent} from 'aurelia-testing';
import {Container} from 'aurelia-dependency-injection';
import {Repeat} from '../src/repeat';
import {MapRepeatStrategy} from '../src/map-repeat-strategy';
import {ViewSlotMock, BoundViewFactoryMock, ViewMock, ViewFactoryMock, instructionMock, viewResourcesMock} from './mocks';
import {bootstrap} from 'aurelia-bootstrapper';

describe('MapRepeatStrategy', () => {
  let repeat, strategy, viewSlot, viewFactory, observerLocator, repeatStrategyLocator, repeatStrategyMock, component;

  beforeEach(done => {
    let aurelia;
    let container = new Container();
    viewSlot = new ViewSlotMock();
    viewFactory = new BoundViewFactoryMock();
    strategy = new MapRepeatStrategy();

    component = StageComponent.withResources().inView('<div repeat.for="[key, value] of items"></div>').boundTo({ items: new Map() });

    component.create(bootstrap).then(() => {
      repeat = component.viewModel;
      repeat.viewSlot = viewSlot;
      repeat.instruction = instructionMock;
      repeat.viewFactory = viewFactory;
      repeat.viewsRequireLifecycle = true;
      done();
    });
  });

  describe('instanceMutated', () => {
    let view1, view2, view3, items, records, viewFactorySpy;

    beforeEach(() => {
      strategy = new MapRepeatStrategy();
      viewSlot.children = [];
      view1 = new ViewMock();
      view2 = new ViewMock();
      view3 = new ViewMock();
      view1.bindingContext = { item: ['foo', 'bar'] };
      view1.overrideContext = {};
      view2.bindingContext = { item: ['qux', 'qax'] };
      view2.overrideContext = {};
      view3.bindingContext = { item: ['john', 'doe'] };
      view3.overrideContext = {};
      viewSlot.children = [view1, view2, view3];
      viewFactorySpy = spyOn(viewFactory, 'create').and.callFake(() => {});
    });
  
    it('should correctly handle adding item (i.e Map.prototype.set())', () => {
      repeat = new Repeat(new ViewFactoryMock(), instructionMock, viewSlot, viewResourcesMock, new ObserverLocator());
      let bindingContext = {};
      repeat.scope = { bindingContext, overrideContext: createOverrideContext(bindingContext) };
      records = [
        {"type": "add", "object": {}, "key": 'norf'}
      ]
      items = new Map([['foo', 'bar'], ['qux', 'qax'], ['john', 'doe'], ['norf', 'narf']]);
      spyOn(viewSlot, 'removeAt').and.callFake(() => { return new ViewMock();});
      strategy.instanceMutated(repeat, items, records);
    
      expect(viewSlot.children.length).toBe(4);
      expect(viewSlot.children[3].bindingContext.key).toBe('norf');
      expect(viewSlot.children[3].overrideContext.$index).toBe(3);
      expect(viewSlot.children[3].overrideContext.$first).toBe(false);
      expect(viewSlot.children[3].overrideContext.$last).toBe(true);
    });
  
    it('should correctly handle clear items (i.e Map.prototype.clear())', () => {
      let view4 = new ViewMock();
      view4.bindingContext = { item: ['norf', 'narf'] };
      view4.overrideContext = {};
      let viewSlotMock = new ViewSlotMock();
      viewSlotMock.children = [view1, view2, view3, view4];
      repeat = new Repeat(new ViewFactoryMock(), instructionMock, viewSlotMock, viewResourcesMock, new ObserverLocator());
      let bindingContext = {};
      repeat.scope = { bindingContext, overrideContext: createOverrideContext(bindingContext) };
      records = [
        {"type": "clear", "object": {}}
      ]
      items = new Map();
      strategy.instanceMutated(repeat, items, records);
    
      expect(viewSlotMock.children.length).toBe(0);
    });
  
    it('should correctly handle adding items after clear (issue 287)', () => {
      viewSlot.children = [view1, view2, view3];
      repeat = new Repeat(new ViewFactoryMock(), instructionMock, viewSlot, viewResourcesMock, new ObserverLocator());
      let bindingContext = {};
      repeat.scope = { bindingContext, overrideContext: createOverrideContext(bindingContext) };
      records = [
        {"type": "clear", "object": {}},
        {"type": "add", "object": {}, "key": 'foo'},
        {"type": "add", "object": {}, "key": 'qux'},
        {"type": "add", "object": {}, "key": 'john'},
        {"type": "add", "object": {}, "key": 'norf'}
      ]
      items = new Map([['foo', 'bar'], ['qux', 'qax'], ['john', 'doe'], ['norf', 'narf']]);
      strategy.instanceMutated(repeat, items, records);

      expect(viewSlot.children.length).toBe(4);
      expect(viewSlot.children[0].bindingContext.key).toBe('foo');
      expect(viewSlot.children[0].overrideContext.$index).toBe(0);
      expect(viewSlot.children[0].overrideContext.$first).toBe(true);
      expect(viewSlot.children[0].overrideContext.$last).toBe(false);
      expect(viewSlot.children[3].bindingContext.key).toBe('norf');
      expect(viewSlot.children[3].overrideContext.$index).toBe(3);
      expect(viewSlot.children[3].overrideContext.$first).toBe(false);
      expect(viewSlot.children[3].overrideContext.$last).toBe(true);
    });

  });

});
