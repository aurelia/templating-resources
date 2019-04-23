import './setup';
import {Container} from 'aurelia-dependency-injection';
import {
  // bindingMode,
  BindingEngine,
  ListenerExpression,
  delegationStrategy,
  // ValueAttributeObserver,
  createScopeForTest
} from 'aurelia-binding';
import {SelfBindingBehavior} from '../src/self-binding-behavior';
import {DOM} from 'aurelia-pal';

describe('SelfBindingBehavior', () => {
  let bindingEngine, lookupFunctions;

  beforeAll(() => {
    bindingEngine = new Container().get(BindingEngine);
    let bindingBehaviors = {
      self: new SelfBindingBehavior()
    };
    lookupFunctions = { bindingBehaviors: name => bindingBehaviors[name] };
  });

  it('should not call source in [trigger]', done => {
    let button = document.createElement('button');
    let target = document.createElement('div');
    target.appendChild(button);
    let bindingExpression = new ListenerExpression(
      bindingEngine.observerLocator.eventManager,
      'click',
      bindingEngine.parseExpression('handleClick($event) & self'),
      delegationStrategy.none,
      false,
      lookupFunctions
    );

    let binding = bindingExpression.createBinding(target);
    let originalCallSource = binding.callSource;

    function exerciseBehavior(callback) {
      let sourceCalls = 0;
      let source = {
        handleClick: e => {
          //console.info('source called');
          sourceCalls++;
        }
      };
      let scope = createScopeForTest(source);

      // overrides updateSource
      binding.bind(scope);
      expect(binding.callSource === originalCallSource).not.toBe(true);

      for (let i = 0, ii = 50; i < ii; i++) {
        button.dispatchEvent(DOM.createCustomEvent('click', { bubbles: true }));
      }

      // How to ensure this happen after all events without timeout?
      let testDuration = 500;
      function endTest() {
        binding.unbind();
        expect(sourceCalls).toEqual(0);
        expect(binding.callSource === originalCallSource).toBe(true);
        callback();
      }
      setTimeout(endTest, testDuration);
    }
    exerciseBehavior(done);
  });

  it('should not call source in [delegate]', done => {
    let button = document.createElement('button');
    let target = document.createElement('div');
    target.appendChild(button);
    let bindingExpression = new ListenerExpression(
      bindingEngine.observerLocator.eventManager,
      'click',
      bindingEngine.parseExpression('handleClick($event) & self'),
      delegationStrategy.bubbling,
      false,
      lookupFunctions
    );

    let binding = bindingExpression.createBinding(target);
    let originalCallSource = binding.callSource;

    function exerciseBehavior(callback) {
      let sourceCalls = 0;
      let source = {
        handleClick: e => {
          //console.info('source called');
          sourceCalls++;
        }
      };
      let scope = createScopeForTest(source);

      // overrides updateSource
      binding.bind(scope);
      expect(binding.callSource === originalCallSource).not.toBe(true);

      for (let i = 0, ii = 50; i < ii; i++) {
        button.dispatchEvent(DOM.createCustomEvent('click', { bubbles: true }));
      }

      // How to ensure this happen after all events without timeout?
      let testDuration = 500;
      function endTest() {
        binding.unbind();
        expect(sourceCalls).toEqual(0);
        expect(binding.callSource === originalCallSource).toBe(true);
        callback();
      }
      setTimeout(endTest, testDuration);
    }
    exerciseBehavior(done);
  });

  it('should not call source in [capture]', done => {
    let button = document.createElement('button');
    let target = document.createElement('div');
    target.appendChild(button);
    let bindingExpression = new ListenerExpression(
      bindingEngine.observerLocator.eventManager,
      'click',
      bindingEngine.parseExpression('handleClick($event) & self'),
      delegationStrategy.capturing,
      false,
      lookupFunctions
    );

    let binding = bindingExpression.createBinding(target);
    let originalCallSource = binding.callSource;

    function exerciseBehavior(callback) {
      let sourceCalls = 0;
      let source = {
        handleClick: e => {
          //console.info('source called');
          sourceCalls++;
        }
      };
      let scope = createScopeForTest(source);

      // overrides updateSource
      binding.bind(scope);
      expect(binding.callSource === originalCallSource).not.toBe(true);

      for (let i = 0, ii = 50; i < ii; i++) {
        button.dispatchEvent(DOM.createCustomEvent('click', { bubbles: true }));
      }

      // How to ensure this happen after all events without timeout?
      let testDuration = 500;
      function endTest() {
        binding.unbind();
        expect(sourceCalls).toEqual(0);
        expect(binding.callSource === originalCallSource).toBe(true);
        callback();
      }
      setTimeout(endTest, testDuration);
    }
    exerciseBehavior(done);
  });
});
