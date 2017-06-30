import './setup';
import {ObserverLocator, createOverrideContext} from 'aurelia-binding';
import {StageComponent} from 'aurelia-testing';
import {Container} from 'aurelia-dependency-injection';
import {Repeat} from '../src/repeat';
import {SetRepeatStrategy} from '../src/set-repeat-strategy';
import {ViewSlotMock, BoundViewFactoryMock, ViewMock, ViewFactoryMock, instructionMock, viewResourcesMock} from './mocks';
import {bootstrap} from 'aurelia-bootstrapper';

describe('SetRepeatStrategy', () => {
  let repeat, strategy, viewSlot, viewFactory, observerLocator, repeatStrategyLocator, repeatStrategyMock, component;

  beforeEach(done => {
    let aurelia;
    let container = new Container();
    viewSlot = new ViewSlotMock();
    viewFactory = new BoundViewFactoryMock();
    strategy = new SetRepeatStrategy();

    component = StageComponent.withResources().inView('<div repeat.for="item of items"></div>').boundTo({ items: [] });

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
      strategy = new SetRepeatStrategy();
      viewSlot.children = [];
      view1 = new ViewMock();
      view2 = new ViewMock();
      view3 = new ViewMock();
      view1.bindingContext = { item: 'foo' };
      view1.overrideContext = {};
      view2.bindingContext = { item: 'qux' };
      view2.overrideContext = {};
      view3.bindingContext = { item: 'bar' };
      view3.overrideContext = {};
      viewSlot.children = [view1, view2, view3];
      viewFactorySpy = spyOn(viewFactory, 'create').and.callFake(() => {});
    });

    it('should correctly handle adding item (i.e Set.prototype.add())', () => {
      repeat = new Repeat(new ViewFactoryMock(), instructionMock, viewSlot, viewResourcesMock, new ObserverLocator());
      let bindingContext = {};
      repeat.scope = { bindingContext, overrideContext: createOverrideContext(bindingContext) };
      records = [{
        type: 'add',
        value: 'norf'
      }];
      items = new Set(['foo', 'qux', 'bar', 'norf']);
      spyOn(viewSlot, 'removeAt').and.callFake(() => { return new ViewMock();});
      strategy.instanceMutated(repeat, items, records);

      expect(viewSlot.children.length).toBe(4);
      expect(viewSlot.children[3].bindingContext.item).toBe('norf');
      expect(viewSlot.children[3].overrideContext.$index).toBe(3);
      expect(viewSlot.children[3].overrideContext.$first).toBe(false);
      expect(viewSlot.children[3].overrideContext.$last).toBe(true);
    });

    it('should correctly handle deleting item (i.e Set.prototype.delete())', () => {
      let view4 = new ViewMock();
      view4.bindingContext = { item: 'norf' };
      view4.overrideContext = {};
      let viewSlotMock = new ViewSlotMock();
      viewSlotMock.children = [view1, view2, view3, view4];
      repeat = new Repeat(new ViewFactoryMock(), instructionMock, viewSlotMock, viewResourcesMock, new ObserverLocator());
      let bindingContext = {};
      repeat.scope = { bindingContext, overrideContext: createOverrideContext(bindingContext) };
      records = [{
        type: 'delete',
        value: 'foo'
      }, {
        type: 'delete',
        value: 'qux'
      }, {
        type: 'delete',
        value: 'bar'
      }];
      items = new Set(['norf']);
      strategy.instanceMutated(repeat, items, records);

      expect(viewSlotMock.children.length).toBe(1);
      expect(viewSlotMock.children[0].bindingContext.item).toBe('norf');
    });

    it('should correctly clear items (i.e. Set.prototype.clear())', () => {
      let view4 = new ViewMock();
      view4.bindingContext = { item: 'norf' };
      view4.overrideContext = {};
      let viewSlotMock = new ViewSlotMock();
      viewSlotMock.children = [view1, view2, view3, view4];
      repeat = new Repeat(new ViewFactoryMock(), instructionMock, viewSlotMock, viewResourcesMock, new ObserverLocator());
      let bindingContext = {};
      repeat.scope = { bindingContext, overrideContext: createOverrideContext(bindingContext) };
      records = [{
        type: 'clear'
      }];
      items = new Set();
      strategy.instanceMutated(repeat, items, records);

      expect(viewSlotMock.children.length).toBe(0);
    });

    it('should correctly delete and add items in the same mutation (issue 284)', () => {
        let view4 = new ViewMock();
        view4.bindingContext = { item: 'norf' };
        view4.overrideContext = {};
        let viewSlotMock = new ViewSlotMock();
        viewSlotMock.children = [view1, view2, view3, view4];
        repeat = new Repeat(new ViewFactoryMock(), instructionMock, viewSlotMock, viewResourcesMock, new ObserverLocator());
        let bindingContext = {};
        repeat.scope = { bindingContext, overrideContext: createOverrideContext(bindingContext) };
        records = [{
          type: 'delete',
          value: 'foo'
        }, {
          type: 'delete',
          value: 'qux'
        }, {
          type: 'delete',
          value: 'bar'
        }, {
          type: 'delete',
          value: 'norf'
        }, {
          type: 'add',
          value: 'baz'
        }, {
          type: 'delete',
          value: 'baz'
        }];
        items = new Set();
        strategy.instanceMutated(repeat, items, records);

        expect(viewSlotMock.children.length).toBe(0);
    });
  });
});
