import {getElementName} from '../src/html-resource-plugin';

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
