import './setup';
import {ObserverLocator, createOverrideContext} from 'aurelia-binding';
import {BoundViewFactory, ViewSlot, ViewFactory, ModuleAnalyzer, TargetInstruction, ViewResources} from 'aurelia-templating';
import {StageComponent} from 'aurelia-testing';
import {Container} from 'aurelia-dependency-injection';
import {Repeat} from '../src/repeat';
import {RepeatStrategyLocator} from '../src/repeat-strategy-locator';
import {ArrayRepeatStrategy} from '../src/array-repeat-strategy';
import {ViewSlotMock, BoundViewFactoryMock, ViewMock, ViewFactoryMock, instructionMock, viewResourcesMock} from './mocks';
import {bootstrap} from 'aurelia-bootstrapper';

describe('ArrayRepeatStrategy', () => {
  let repeat, strategy, viewSlot, viewFactory, observerLocator, repeatStrategyLocator, repeatStrategyMock, component;

  beforeEach(done => {
    let aurelia;
    let container = new Container();
    viewSlot = new ViewSlotMock();
    viewFactory = new BoundViewFactoryMock();
    strategy = new ArrayRepeatStrategy();

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
    let view1, view2, view3, items, splices, viewFactorySpy;

    beforeEach(() => {
      strategy = new ArrayRepeatStrategy();
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

    it('should update binding context after views are unbinded', () => {
      items = ['foo', 'qux', 'bar'];
      splices = [{
        addedCount: 0,
        index: 1,
        removed: ['qux']
      }];
      spyOn(viewSlot, 'removeAt').and.callFake(() => { return new ViewMock();});
      strategy.instanceMutated(repeat, items, splices);

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

      strategy.instanceMutated(repeat, items, splices);

      Promise.all(rmPromises).then(() => {
        expect(viewSlot.children.length).toBe(2);

        expect(viewSlot.children[0].overrideContext.$index).toBe(0);
        expect(viewSlot.children[0].bindingContext.item).toBe('foo');

        expect(viewSlot.children[1].overrideContext.$index).toBe(1);
        expect(viewSlot.children[1].bindingContext.item).toBe('bar');
        done();
      });
    });

    it('should correctly handle adding item (i.e Array.prototype.push())', () => {
      repeat = new Repeat(new ViewFactoryMock(), instructionMock, viewSlot, viewResourcesMock, new ObserverLocator());
      let bindingContext = {};
      repeat.scope = { bindingContext, overrideContext: createOverrideContext(bindingContext) };
      splices = [{
        addedCount: 1,
        index: 3,
        removed: []
      }];
      items = ['foo', 'qux', 'bar', 'norf'];
      spyOn(viewSlot, 'removeAt').and.callFake(() => { return new ViewMock();});
      strategy.instanceMutated(repeat, items, splices);

      expect(viewSlot.children.length).toBe(4);
      expect(viewSlot.children[3].bindingContext.item).toBe('norf');
      expect(viewSlot.children[3].overrideContext.$index).toBe(3);
      expect(viewSlot.children[3].overrideContext.$first).toBe(false);
      expect(viewSlot.children[3].overrideContext.$last).toBe(true);
    });

    it('should correctly handle adding and removing (i.e Array.prototype.splice())', () => {
      let view4 = new ViewMock();
      view4.bindingContext = { item: 'norf' };
      view4.overrideContext = {};
      let viewSlotMock = new ViewSlotMock();
      viewSlotMock.children = [view1, view2, view3, view4];
      repeat = new Repeat(new ViewFactoryMock(), instructionMock, viewSlotMock, viewResourcesMock, new ObserverLocator());
      let bindingContext = {};
      repeat.scope = { bindingContext, overrideContext: createOverrideContext(bindingContext) };
      splices = [{
        addedCount: 1,
        index: 0,
        removed: ['foo', 'qux', 'bar']
      }];
      items = ['bar_updated', 'norf'];
      strategy.instanceMutated(repeat, items, splices);

      expect(viewSlotMock.children.length).toBe(2);
      expect(viewSlotMock.children[0].bindingContext.item).toBe('bar_updated');
      expect(viewSlotMock.children[1].bindingContext.item).toBe('norf');
    });

    it('should correctly handle multiple splices adding and removing (i.e Array.prototype.reverse())', () => {
      let view4 = new ViewMock();
      view4.overrideContext = { item: 'norf' };
      let viewSlotMock = new ViewSlotMock();
      viewSlotMock.children = [view1, view2, view3, view4];
      repeat = new Repeat(new ViewFactoryMock(), instructionMock, viewSlotMock, viewResourcesMock, new ObserverLocator());
      let bindingContext = {};
      repeat.scope = { bindingContext, overrideContext: createOverrideContext(bindingContext) };

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
      strategy.instanceMutated(repeat, items, splices);

      expect(viewSlotMock.children.length).toBe(4);
      expect(viewSlotMock.children[0].bindingContext.item).toBe('norf');
      expect(viewSlotMock.children[1].bindingContext.item).toBe('bar');
      expect(viewSlotMock.children[2].bindingContext.item).toBe('qux');
      expect(viewSlotMock.children[3].bindingContext.item).toBe('foo');

      expect(viewSlotMock.children[0].overrideContext.$index).toBe(0);
      expect(viewSlotMock.children[1].overrideContext.$index).toBe(1);
      expect(viewSlotMock.children[2].overrideContext.$index).toBe(2);
      expect(viewSlotMock.children[3].overrideContext.$index).toBe(3);
    });

    it('moving animated item', done => {
      let viewSlotMock = new ViewSlotMock();
      viewSlotMock.children = [view1, view2, view3];
      repeat = new Repeat(new ViewFactoryMock(), instructionMock, viewSlotMock, viewResourcesMock, new ObserverLocator());
      let bindingContext = {};
      repeat.scope = { bindingContext, overrideContext: createOverrideContext(bindingContext) };

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

      strategy.instanceMutated(repeat, items, splices);

      animationPromise.then(() => {
        expect(viewSlotMock.children.length).toBe(3);
        expect(viewSlotMock.children[0].bindingContext.item).toBe('qux');
        expect(viewSlotMock.children[1].bindingContext.item).toBe('foo');
        expect(viewSlotMock.children[2].bindingContext.item).toBe('bar');

        expect(viewSlotMock.children[0].overrideContext.$index).toBe(0);
        expect(viewSlotMock.children[1].overrideContext.$index).toBe(1);
        expect(viewSlotMock.children[2].overrideContext.$index).toBe(2);

        done();
      });
    });

    describe('during animation', () => {
      let delay = ms => new Promise(resolve => setTimeout(resolve, ms));

      let removeAtWithAnimation = animationDuration => {
        return function(index) {
          let view = this.children[index];
          return delay(animationDuration).then(() => {
            this.children.splice(this.children.indexOf(view), 1);
          });
        };
      };

      beforeEach(() => {
        viewFactorySpy.and.callFake(() => new ViewMock());
        spyOn(viewSlot, 'removeAt').and.callFake(removeAtWithAnimation(500));
      });

      it('should correctly handle insert during remove animation', done => {
        items = ['qux'];
        splices = [{
          addedCount: 0,
          index: 0,
          removed: ['foo']
        }, {
          addedCount: 0,
          index: 1,
          removed: ['bar']
        }];

        strategy.instanceMutated(repeat, items, splices);

        // after 300ms the leave animation from the previous splice set is still playing
        delay(300).then(() => {
          splices = [{ addedCount: 1, index: 1, removed: [] }];
          strategy.instanceMutated(repeat, ['qux', 'Bar'], splices);
          return delay(700);
        })
        .then(() => {
          expect(viewSlot.children.length).toEqual(2);
          expect(viewSlot.children[0].bindingContext.item).toBe('qux');
          expect(viewSlot.children[1].bindingContext.item).toBe('Bar');
        })
        .then(() => done())
      })
    })
  });
});
