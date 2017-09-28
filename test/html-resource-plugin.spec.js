import {bindingMode} from 'aurelia-binding';
import {HtmlBehaviorResource} from 'aurelia-templating';
import {getElementName} from '../src/html-resource-plugin';
import {_createDynamicElement} from '../src/dynamic-element';
import {metadata} from 'aurelia-metadata';

describe('html-resource-plugin', () => {
  it('computes element name', () => {
    expect(getElementName('foo.html')).toBe('foo');
    expect(getElementName('FOO.HTML')).toBe('foo');
    expect(getElementName('/foo.html')).toBe('foo');
    expect(getElementName('bar/foo.html')).toBe('foo');
    expect(getElementName('foo.html?bar')).toBe('foo');
    expect(getElementName('foo.html?bar.html')).toBe('foo');
    expect(getElementName('https://bar/foo.html?bar.html')).toBe('foo');
  });
});

describe('dynamic-element', () => {
  it('creates dynamic element in normal usage', () => {
    const propName = 'balance';
    const coerce = 'number';
    const defaultBindingMode = 'oneWay';
    const DynamicElement = _createDynamicElement('foo', 'bar', [`${propName}:${coerce} & ${defaultBindingMode}`]);
    const resource = metadata.get(metadata.resource, DynamicElement);
    const bindableProperty = resource.attributes[propName];
    const test = prop => prop.name === propName && prop.coerce === coerce && prop.defaultBindingMode === bindingMode[defaultBindingMode];
    expect(test(bindableProperty)).toBe(true);
  });

  it('creates dynamic element in spaceful usage', () => {
    const propName = 'balance';
    const coerce = 'number';
    const defaultBindingMode = 'oneWay';
    const DynamicElement = _createDynamicElement('foo', 'bar', [` ${propName} : ${coerce} & ${defaultBindingMode} `]);
    const resource = metadata.get(metadata.resource, DynamicElement);
    const bindableProperty = resource.attributes[propName];
    const test = prop => prop.name === propName && prop.coerce === coerce && prop.defaultBindingMode === bindingMode[defaultBindingMode];
    expect(test(bindableProperty)).toBe(true);
  });

  it('creates dynamic element without default binding mode', () => {
    const propName = 'balance';
    const coerce = 'number';
    const DynamicElement = _createDynamicElement('foo', 'bar', [` ${propName} : ${coerce}  `]);
    const resource = metadata.get(metadata.resource, DynamicElement);
    const bindableProperty = resource.attributes[propName];
    const test = prop => prop.name === propName && prop.coerce === coerce && prop.defaultBindingMode === bindingMode.oneWay;
    expect(test(bindableProperty)).toBe(true);
  });

  it('creates dynamic element without coerce', () => {
    const propName = 'balance';
    const defaultBindingMode = 'oneWay';
    const DynamicElement = _createDynamicElement('foo', 'bar', [` ${propName} & ${defaultBindingMode} `]);
    const resource = metadata.get(metadata.resource, DynamicElement);
    const bindableProperty = resource.attributes[propName];
    const test = prop => prop.name === propName && prop.coerce === undefined && prop.defaultBindingMode === bindingMode[defaultBindingMode];
    expect(test(bindableProperty)).toBe(true);
  });
});
