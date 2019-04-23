import './setup';
import { Container } from 'aurelia-dependency-injection';
import {
  bindingMode,
  BindingEngine,
  ListenerExpression,
  delegationStrategy,
  ValueAttributeObserver,
  createScopeForTest
} from 'aurelia-binding';
import { DebounceBindingBehavior } from '../src/debounce-binding-behavior';
import { DOM } from 'aurelia-pal';

describe('DebounceBindingBehavior', () => {
  let bindingEngine, lookupFunctions;

  beforeAll(() => {
    bindingEngine = new Container().get(BindingEngine);
    let bindingBehaviors = {
      debounce: new DebounceBindingBehavior()
    };
    lookupFunctions = { bindingBehaviors: name => bindingBehaviors[name] };
  });

  beforeEach(() => {
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should debounce target updates', () => {
    let source = { foo: -1 };
    let scope = createScopeForTest(source);
    let target = DOM.createElement('input');
    let delay = 150;
    let bindingExpression = bindingEngine.createBindingExpression(
      'value',
      `foo & debounce:${delay}`,
      bindingMode.toView || bindingMode.oneWay,
      lookupFunctions
    );
    let binding = bindingExpression.createBinding(target);
    let originalCallMethod = binding.call;

    // overrides call
    binding.bind(scope);
    expect(binding.call === originalCallMethod).not.toBe(true);

    // subscribes
    let observer = bindingEngine.observerLocator.getObserver(source, 'foo');
    expect(observer.hasSubscribers()).toBe(true);

    let lastValue = target.value;
    let exerciseTimes = 10;
    while (exerciseTimes--) {
      let tick = Math.floor(Math.random() * delay + delay / 3);
      // Greater than only will fail in case the tick is close to delay. ex: delay: 150, tick: 149, 150
      let shouldUpdate = tick >= delay;
      source.foo++;

      // updating in toView mode is controlled by taskqueue
      // constantly flush the queue to avoid waiting for the real queue to be flushed.
      bindingEngine.observerLocator.taskQueue.flushMicroTaskQueue();
      // console.log({ tick, shouldUpdate, val: target.value, foo: source.foo });

      // pull the trigger
      jasmine.clock().tick(tick);

      expect(target.value).toBe(shouldUpdate ? source.foo.toString() : lastValue);
      lastValue = target.value;
    }

    binding.unbind();
    expect(binding.call === originalCallMethod).toBe(true);
    expect(observer.hasSubscribers()).toBe(false);
  });

  it('should debounce source updates', () => {
    let target = DOM.createElement('input');
    let delay = 150;
    let bindingExpression = bindingEngine.createBindingExpression(
      'value',
      `foo & debounce:${delay}`,
      bindingMode.twoWay,
      lookupFunctions
    );
    let binding = bindingExpression.createBinding(target);
    let originalCallMethod = binding.call;

    let source = {};
    let scope = createScopeForTest(source);

    // overrides call
    binding.bind(scope);
    expect(binding.call === originalCallMethod).not.toBe(true);

    let exerciseTimes = 10;
    while (exerciseTimes--) {
      let tick = Math.floor(Math.random() * delay + delay / 3);
      let shouldUpdate = tick >= delay;

      target.value = Math.floor(Math.random() * 10000);
      target.dispatchEvent(DOM.createCustomEvent('change'));
      // console.log({ tick, shouldUpdate, val: target.value, foo: source.foo });

      // pull the trigger
      jasmine.clock().tick(tick);
      if (shouldUpdate) {
        expect(source.foo).toBe(target.value);
      } else {
        expect(source.foo).not.toBe(target.value);
      }
    }

    binding.unbind();
    expect(binding.call === originalCallMethod).toBe(true);
  });

  it('should debounce call source', () => {
    let target = document.createElement('div');
    let delay = 150;
    let bindingExpression = new ListenerExpression(
      bindingEngine.observerLocator.eventManager,
      'mousemove',
      bindingEngine.parseExpression(`handleMouseMove($event) & debounce:${delay}`),
      delegationStrategy.none,
      false,
      lookupFunctions
    );

    let binding = bindingExpression.createBinding(target);
    let originalCallSource = binding.callSource;

    let viewModel = {
      callCount: 0,
      handleMouseMove: e => {
        viewModel.callCount++;
      }
    };
    let scope = createScopeForTest(viewModel);

    // overrides callSource
    binding.bind(scope);
    expect(binding.callSource === originalCallSource).not.toBe(true);

    let exerciseCount = 10;
    let callCount = 0;
    while (exerciseCount--) {
      let tick = Math.floor(Math.random() * delay + delay / 3);
      let shouldCall = tick >= delay;

      target.dispatchEvent(DOM.createCustomEvent('mousemove'));
      jasmine.clock().tick(tick);

      callCount += shouldCall;
    }

    expect(callCount).toBe(viewModel.callCount);
    binding.unbind();
    expect(binding.callSource === originalCallSource).toBe(true);
  });
});
