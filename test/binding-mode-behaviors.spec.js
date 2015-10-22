import {Container} from 'aurelia-dependency-injection';
import {bindingMode, BindingEngine} from 'aurelia-binding';
import {initialize as initializePAL} from 'aurelia-pal-browser';
import {
  OneTimeBindingBehavior,
  OneWayBindingBehavior,
  TwoWayBindingBehavior
} from '../src/binding-mode-behaviors';

describe('binding mode behaviors', () => {
  let bindingEngine;

  beforeAll(() => {
    initializePAL();
    bindingEngine = new Container().get(BindingEngine);
  });

  it('bind', () => {
    let bindingBehaviors = {
      oneTime: new OneTimeBindingBehavior(),
      oneWay: new OneWayBindingBehavior(),
      twoWay: new TwoWayBindingBehavior()
    };
    let lookupFunctions = { bindingBehaviors: name => bindingBehaviors[name] };
    let source = { foo: 'bar' };
    let target = document.createElement('input');

    // one time
    let bindingExpression = bindingEngine.createBindingExpression('value', 'foo & oneTime', bindingMode.twoWay, lookupFunctions);
    let binding = bindingExpression.createBinding(target);
    binding.bind(source);
    expect(binding.mode).toBe(bindingMode.oneTime);
    binding.unbind();

    // one way
    bindingExpression = bindingEngine.createBindingExpression('value', 'foo & oneWay', bindingMode.twoWay, lookupFunctions);
    binding = bindingExpression.createBinding(target);
    binding.bind(source);
    expect(binding.mode).toBe(bindingMode.oneWay);
    binding.unbind();

    // two way
    bindingExpression = bindingEngine.createBindingExpression('value', 'foo & twoWay', bindingMode.oneTime, lookupFunctions);
    binding = bindingExpression.createBinding(target);
    binding.bind(source);
    expect(binding.mode).toBe(bindingMode.twoWay);
    binding.unbind();
  });
});
