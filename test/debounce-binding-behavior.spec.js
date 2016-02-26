import './setup';
import {Container} from 'aurelia-dependency-injection';
import {
  bindingMode,
  BindingEngine,
  ListenerExpression,
  ValueAttributeObserver,
  createScopeForTest
} from 'aurelia-binding';
import {DebounceBindingBehavior} from '../src/debounce-binding-behavior';
import {DOM} from 'aurelia-pal';

describe('DebounceBindingBehavior', () => {
  let bindingEngine, lookupFunctions;

  beforeAll(() => {
    bindingEngine = new Container().get(BindingEngine);
    let bindingBehaviors = {
      debounce: new DebounceBindingBehavior()
    };
    lookupFunctions = { bindingBehaviors: name => bindingBehaviors[name] };
  });

  it('should debounce target updates', done => {
    let source = { foo: 0 };
    let scope = createScopeForTest(source);
    let target = document.createElement('input');
    let delay = 150;
    let bindingExpression = bindingEngine.createBindingExpression('value', `foo & debounce:${delay}`, bindingMode.oneWay, lookupFunctions);
    let binding = bindingExpression.createBinding(target);
    let originalMethod = binding.updateTarget;

    function exerciseBehavior(callback) {
      // overrides updateTarget
      binding.bind(scope);
      expect(binding.updateTarget === originalMethod).not.toBe(true);

      // subscribes
      let observer = bindingEngine.observerLocator.getObserver(source, 'foo');
      expect(observer.hasSubscribers()).toBe(true);

      // updates
      let updates = [30, 30, delay + 30, 30, 30, 30, 30, delay + 30, 30, 30, 30, 30, 30];

      // test cleanup
      let checkInterval;
      let expectedUpdates = updates.filter(x => x > delay).length;
      function endTest() {
        clearInterval(checkInterval);
        binding.unbind();
        expect(binding.updateTarget === originalMethod).toBe(true);
        expect(observer.hasSubscribers()).toBe(false);
        expect(sourceUpdates).toBe(expectedUpdates);
        callback();
      }

      // perform updates
      let i = 0;
      let lastUpdateTime;
      let next;
      next = () => {
        source.foo++;
        lastUpdateTime = new Date();
        if (i < updates.length) {
          setTimeout(next, updates[i]);
          i++;
        } else {
          endTest();
        }
      }
      next();

      let sourceUpdates = 0;
      let lastValue = target.value;
      checkInterval = setInterval(() => {
        if(target.value !== lastValue) {
          lastValue = target.value;
          sourceUpdates++;
          // value changed... was it debounced?
          let elapsed = new Date() - lastUpdateTime;
          expect(elapsed).toBeGreaterThan(delay - 30);
          expect(elapsed).toBeLessThan(delay + 30);
        }
      }, 20);
    }
    exerciseBehavior(() => exerciseBehavior(done));
  });

  it('should debounce source updates', done => {
    let target = document.createElement('input');
    let delay = 150;
    let bindingExpression = bindingEngine.createBindingExpression('value', `foo & debounce:${delay}`, bindingMode.twoWay, lookupFunctions);
    let binding = bindingExpression.createBinding(target);
    let originalMethod = binding.updateSource;

    function exerciseBehavior(callback) {
      //console.info(`=======================================================`);
      let source = {};
      let scope = createScopeForTest(source);
      let _foo = '0';
      let lastUpdateTime = null;
      let sourceUpdates = 0;
      Object.defineProperty(source, 'foo', {
        get: () => _foo,
        set: newValue => {
          //console.info(`SET FOO:  newValue=${newValue}; oldValue=${_foo}`);
          _foo = newValue;
          if (lastUpdateTime !== null) {
            sourceUpdates++;
            let elapsed = new Date() - lastUpdateTime;
            expect(elapsed).toBeGreaterThan(delay - 30);
            expect(elapsed).toBeLessThan(delay + 30);
            expect(target.value).toBe(newValue);
          }
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

      // updates
      let updates = [30, 30, delay + 30, 30, 30, 30, 30, delay + 30, 30, 30, 30, 30, 30];

      // test cleanup
      let expectedUpdates = updates.filter(x => x > delay).length;
      function endTest() {
        binding.unbind();
        expect(binding.updateSource === originalMethod).toBe(true);
        expect(observer.hasSubscribers()).toBe(false);
        expect(sourceUpdates).toBe(expectedUpdates);
        callback();
      }

      // perform updates
      let i = 0;
      let next;
      next = () => {
        let elapsed = new Date() - lastUpdateTime;
        lastUpdateTime = new Date();
        let newValue = (parseInt(target.value, 10) + 1).toString();
        //console.info(`NOTIFYING:  newValue=${newValue}; oldValue=${target.value}; elapsed=${elapsed}; ${i}`);
        target.value = newValue;
        target.dispatchEvent(DOM.createCustomEvent('change'));
        if (i < updates.length) {
          setTimeout(next, updates[i]);
          i++;
        } else {
          endTest();
        }
      }
      next();
    }
    exerciseBehavior(() => exerciseBehavior(done));
  });

  it('should debounce call source', done => {
    let target = document.createElement('div');
    let delay = 150;
    let bindingExpression = new ListenerExpression(
      bindingEngine.observerLocator.eventManager,
      'mousemove',
      bindingEngine.parseExpression(`handleMouseMove($event) & debounce:${delay}`),
      false,
      false,
      lookupFunctions
    );

    let binding = bindingExpression.createBinding(target);
    let originalMethod = binding.callSource;

    function exerciseBehavior(callback) {
      //console.info(`=======================================================`);
      let lastUpdateTime = null;
      let sourceUpdates = 0;
      let source = {
        handleMouseMove: e => {
          //console.info(`SOURCE CALLED`);
          if (lastUpdateTime !== null) {
            sourceUpdates++;
            let elapsed = new Date() - lastUpdateTime;
            expect(elapsed).toBeGreaterThan(delay - 30);
            expect(elapsed).toBeLessThan(delay + 30);
          }
        }
      };
      let scope = createScopeForTest(source);

      // overrides updateSource
      binding.bind(scope);
      expect(binding.callSource === originalMethod).not.toBe(true);

      // updates
      let updates = [30, 30, delay + 30, 30, 30, 30, 30, delay + 30, 30, 30, 30, 30, 30];

      // test cleanup
      let expectedUpdates = updates.filter(x => x > delay).length;
      function endTest() {
        binding.unbind();
        expect(binding.callSource === originalMethod).toBe(true);
        expect(sourceUpdates).toBe(expectedUpdates);
        callback();
      }

      // perform updates
      let i = 0;
      let next;
      next = () => {
        let elapsed = new Date() - lastUpdateTime;
        lastUpdateTime = new Date();
        let newValue = (parseInt(target.value, 10) + 1).toString();
        //console.info(`MOUSEMOVE elapsed=${elapsed}; ${i}`);
        target.value = newValue;
        target.dispatchEvent(DOM.createCustomEvent('mousemove'));
        if (i < updates.length) {
          setTimeout(next, updates[i]);
          i++;
        } else {
          endTest();
        }
      }
      next();
    }
    exerciseBehavior(() => exerciseBehavior(done));
  });
});
