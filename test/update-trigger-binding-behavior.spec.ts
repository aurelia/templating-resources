import './setup';
import {Container} from 'aurelia-dependency-injection';
import {
  bindingMode,
  BindingEngine,
  ListenerExpression,
  ValueAttributeObserver,
  createScopeForTest
} from 'aurelia-binding';
import {UpdateTriggerBindingBehavior} from '../src/update-trigger-binding-behavior';
import {DOM} from 'aurelia-pal';

describe('UpdateTriggerBindingBehavior', () => {
  let bindingEngine, lookupFunctions;

  beforeAll(() => {
    let container = new Container();
    bindingEngine = container.get(BindingEngine);
    let bindingBehaviors = {
      updateTrigger: container.get(UpdateTriggerBindingBehavior)
    };
    lookupFunctions = { bindingBehaviors: name => bindingBehaviors[name] };
  });

  it('should apply update trigger events', () => {
    let source = { foo: 'bar' };
    let scope = createScopeForTest(source);
    let target = document.createElement('input');
    let bindingExpression = bindingEngine.createBindingExpression('value', `foo & updateTrigger:'blur':'paste'`, bindingMode.twoWay, lookupFunctions);
    let binding = bindingExpression.createBinding(target);

    binding.bind(scope);
    let targetHandler = binding.targetObserver.handler;

    target.value = 'baz';
    target.dispatchEvent(DOM.createCustomEvent('change'));
    expect(source.foo).toBe('bar');
    target.dispatchEvent(DOM.createCustomEvent('blur'));
    expect(source.foo).toBe('baz');

    target.value = 'bang';
    target.dispatchEvent(DOM.createCustomEvent('change'));
    expect(source.foo).toBe('baz');
    target.dispatchEvent(DOM.createCustomEvent('paste'));
    expect(source.foo).toBe('bang');


    binding.unbind();

    target.value = 'target';
    target.dispatchEvent(DOM.createCustomEvent('blur'));
    expect(source.foo).toBe('bang');
    target.dispatchEvent(DOM.createCustomEvent('paste'));
    expect(source.foo).toBe('bang');

    // also makes sure we disposed the listeners
    expect(targetHandler.element).toBe(null);
  });
});
