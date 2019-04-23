import './setup';
import {Container} from 'aurelia-dependency-injection';
import {bindingMode, BindingEngine, createScopeForTest} from 'aurelia-binding';
import {InterpolationBindingExpression} from 'aurelia-templating-binding';
import {SignalBindingBehavior} from '../src/signal-binding-behavior';
import {BindingSignaler} from '../src/binding-signaler';

describe('SignalBindingBehavior', () => {
  let bindingEngine, lookupFunctions, converterResult, bindingSignaler;

  beforeAll(() => {
    let container = new Container();
    bindingEngine = container.get(BindingEngine);
    let bindingBehaviors = {
      signal: container.get(SignalBindingBehavior)
    };
    let valueConverters = {
      testConverter: {
        toView(value) {
          return converterResult;
        }
      }
    }
    lookupFunctions = {
      bindingBehaviors: name => bindingBehaviors[name],
      valueConverters: name => valueConverters[name]
    };
    bindingSignaler = container.get(BindingSignaler);
  });

  it('should not throw in one-time binding', () => {
    let source = {};
    let scope = createScopeForTest(source);
    let target = document.createElement('input');
    let bindingExpression = bindingEngine.createBindingExpression('value', `'foo' & signal:'test'`, bindingMode.oneTime, lookupFunctions);
    let binding = bindingExpression.createBinding(target);
    expect(() => binding.bind(scope)).not.toThrow();
  });

  it('should signal binding', () => {
    let source = { updateDateTime: new Date() };
    let scope = createScopeForTest(source);
    let target = document.createElement('input');
    let bindingExpression = bindingEngine.createBindingExpression('value', `updateDateTime | testConverter & signal:'test'`, bindingMode.oneWay, lookupFunctions);
    let binding = bindingExpression.createBinding(target);
    converterResult = 'hello';
    binding.bind(scope);
    expect(target.value).toBe(converterResult);
    converterResult = 'world';
    bindingSignaler.signal('test');
    expect(target.value).toBe(converterResult);
  });

  it('should signal one-time binding', () => {
    let source = { updateDateTime: new Date() };
    let scope = createScopeForTest(source);
    let target = document.createElement('input');
    let bindingExpression = bindingEngine.createBindingExpression('value', `updateDateTime | testConverter & signal:'test'`, bindingMode.oneTime, lookupFunctions);
    let binding = bindingExpression.createBinding(target);
    converterResult = 'hello';
    binding.bind(scope);
    expect(target.value).toBe(converterResult);
    converterResult = 'world';
    bindingSignaler.signal('test');
    expect(target.value).toBe(converterResult);
  });

  it('should signal interpolation binding', () => {
    let source = { updateDateTime: new Date() };
    let scope = createScopeForTest(source);
    let target = document.createElement('div');
    let bindingExpression = new InterpolationBindingExpression(
      bindingEngine.observerLocator,
      'textContent',
      ['', bindingEngine.parseExpression(`updateDateTime | testConverter & signal:'test'`), ''],
      bindingMode.oneWay,
      lookupFunctions
    );

    let binding = bindingExpression.createBinding(target);
    converterResult = 'hello';
    binding.bind(scope);
    expect(target.textContent).toBe(converterResult);
    converterResult = 'world';
    bindingSignaler.signal('test');
    expect(target.textContent).toBe(converterResult);
  });

  it('should signal binding with multiple signal names', () => {
    let source = { updateDateTime: new Date() };
    let scope = createScopeForTest(source);
    let target = document.createElement('input');
    let bindingExpression = bindingEngine.createBindingExpression('value', `updateDateTime | testConverter & signal:'test':'another-test'`, bindingMode.oneWay, lookupFunctions);
    let binding = bindingExpression.createBinding(target);
    converterResult = 'hello';
    binding.bind(scope);
    expect(target.value).toBe(converterResult);
    converterResult = 'world';
    bindingSignaler.signal('test');
    expect(target.value).toBe(converterResult);
    converterResult = 'awesome';
    bindingSignaler.signal('another-test');
    expect(target.value).toBe(converterResult);
  });
});
