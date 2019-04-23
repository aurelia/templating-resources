import './setup';
import {Container} from 'aurelia-dependency-injection';
import {
  bindingMode,
  BindingEngine,
  ListenerExpression,
  delegationStrategy,
  ValueAttributeObserver,
  createScopeForTest
} from 'aurelia-binding';
import {ThrottleBindingBehavior} from '../src/throttle-binding-behavior';
import {DOM} from 'aurelia-pal';

describe('ThrottleBindingBehavior', () => {
  let bindingEngine, lookupFunctions;

  beforeAll(() => {
    bindingEngine = new Container().get(BindingEngine);
    let bindingBehaviors = {
      throttle: new ThrottleBindingBehavior()
    };
    lookupFunctions = { bindingBehaviors: name => bindingBehaviors[name] };
  });

  it('should throttle target updates', done => {
    let source = { foo: 0 };
    let scope = createScopeForTest(source);
    let target = document.createElement('input');
    let delay = 150;
    let bindingExpression = bindingEngine.createBindingExpression('value', `foo & throttle:${delay}`, bindingMode.oneWay, lookupFunctions);
    let binding = bindingExpression.createBinding(target);
    let originalMethod = binding.updateTarget;

    function exerciseBehavior(callback) {
      // overrides updateTarget
      binding.bind(scope);
      expect(binding.updateTarget === originalMethod).not.toBe(true);

      // subscribes
      let observer = bindingEngine.observerLocator.getObserver(source, 'foo');
      expect(observer.hasSubscribers()).toBe(true);

      // throttles
      let lastTargetUpdate = new Date();
      let lastTargetValue = target.value;
      let targetUpdates = 0;
      let updateSourceInterval = setInterval(() => {
        source.foo++;
        if (target.value !== lastTargetValue) {
          // the target was updated... was it throttled?
          let elapsed = new Date() - lastTargetUpdate;
          expect(elapsed).toBeGreaterThan(delay - 30);
          expect(elapsed).toBeLessThan(delay + 30);
          // increment
          lastTargetUpdate = new Date();
          lastTargetValue = target.value;
          targetUpdates++;
        }
      }, 20);

      let testDuration = 500;
      function endTest() {
        clearInterval(updateSourceInterval);
        binding.unbind();
        expect(targetUpdates).toBeGreaterThan(Math.floor(testDuration / delay) - 1);
        expect(targetUpdates).toBeLessThan(Math.floor(testDuration / delay) + 1);
        expect(binding.updateTarget === originalMethod).toBe(true);
        expect(observer.hasSubscribers()).toBe(false);
        callback();
      }
      setTimeout(endTest, testDuration);
    }
    exerciseBehavior(() => exerciseBehavior(done));
  });

  it('should throttle source updates', done => {
    let target = document.createElement('input');
    let delay = 150;
    let bindingExpression = bindingEngine.createBindingExpression('value', `foo & throttle:${delay}`, bindingMode.twoWay, lookupFunctions);
    let binding = bindingExpression.createBinding(target);
    let originalMethod = binding.updateSource;

    function exerciseBehavior(callback) {
      let source = {};
      let scope = createScopeForTest(source);
      let _foo = '0';
      let last = null;
      let sourceUpdates = 0;
      Object.defineProperty(source, 'foo', {
        get: () => _foo,
        set: newValue => {
          // console.info(`SET FOO:  newValue=${newValue}; oldValue=${_foo}`);
          _foo = newValue;
          if (last !== null) {
            sourceUpdates++;
            let elapsed = new Date() - last;
            expect(elapsed).toBeGreaterThan(delay - 30);
            expect(elapsed).toBeLessThan(delay + 30);
            expect(target.value).toBe(newValue);
          }
          last = new Date();
        }
      });

      // overrides updateSource
      binding.bind(scope);
      expect(binding.updateSource === originalMethod).not.toBe(true);

      // subscribes
      let observer = bindingEngine.observerLocator.getObserver(source, 'foo');
      expect(observer.hasSubscribers()).toBe(true);
      let targetObserver = bindingEngine.observerLocator.getObserver(target, 'value');
      expect(targetObserver.hasSubscribers()).toBe(true);
      expect(targetObserver instanceof ValueAttributeObserver).toBe(true);

      // throttles
      let updateSourceInterval = setInterval(() => {
        let newValue = (parseInt(target.value, 10) + 1).toString();
        //console.info(`NOTIFYING:  newValue=${newValue}; oldValue=${target.value}`);
        target.value = newValue;
        target.dispatchEvent(DOM.createCustomEvent('change'));
      }, 20);

      let testDuration = 500;
      function endTest() {
        clearInterval(updateSourceInterval);
        binding.unbind();
        expect(sourceUpdates).toBeGreaterThan(Math.floor(testDuration / delay) - 1);
        expect(sourceUpdates).toBeLessThan(Math.floor(testDuration / delay) + 1);
        expect(binding.updateSource === originalMethod).toBe(true);
        expect(observer.hasSubscribers()).toBe(false);
        expect(targetObserver.hasSubscribers()).toBe(false);
        callback();
      }
      setTimeout(endTest, testDuration);
    }
    exerciseBehavior(() => exerciseBehavior(done));
  });

  it('should throttle call source', done => {
    let target = document.createElement('div');
    let delay = 150;
    let bindingExpression = new ListenerExpression(
      bindingEngine.observerLocator.eventManager,
      'mousemove',
      bindingEngine.parseExpression(`handleMouseMove($event) & throttle:${delay}`),
      delegationStrategy.none,
      false,
      lookupFunctions
    );

    let binding = bindingExpression.createBinding(target);
    let originalMethod = binding.callSource;

    function exerciseBehavior(callback) {
      let sourceUpdates = 0;
      let last = null;
      let source = {
        handleMouseMove: e => {
          //console.info('source called');
          if (last !== null) {
            sourceUpdates++;
            let elapsed = new Date() - last;
            expect(elapsed).toBeGreaterThan(delay - 30);
            expect(elapsed).toBeLessThan(delay + 30);
          }
          last = new Date();
        }
      };
      let scope = createScopeForTest(source);

      // overrides updateSource
      binding.bind(scope);
      expect(binding.callSource === originalMethod).not.toBe(true);

      // throttles
      let updateSourceInterval = setInterval(() => {
        //console.info('dispatching');
        target.dispatchEvent(DOM.createCustomEvent('mousemove'));
      }, 20);

      let testDuration = 500;
      function endTest() {
        clearInterval(updateSourceInterval);
        binding.unbind();
        expect(sourceUpdates).toBeGreaterThan(Math.floor(testDuration / delay) - 1);
        expect(sourceUpdates).toBeLessThan(Math.floor(testDuration / delay) + 1);
        expect(binding.callSource === originalMethod).toBe(true);
        callback();
      }
      setTimeout(endTest, testDuration);
    }
    exerciseBehavior(done);
  });
});
