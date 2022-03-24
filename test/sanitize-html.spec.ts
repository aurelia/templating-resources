import './setup';
import {SanitizeHTMLValueConverter} from '../src/sanitize-html';
import {HTMLSanitizer} from '../src/html-sanitizer';

describe('SanitizeHtmlValueConverter', () => {
  let converter;

  beforeEach(() => {
    converter = new SanitizeHTMLValueConverter(new HTMLSanitizer());
  });

  it('defaultSanitizer should throw', () => {
    expect(() => converter.toView('')).toThrow();
  });

  it('custom sanitizers can be used', () => {
    spyOn(converter.sanitizer, 'sanitize');
    converter.toView('test');
    expect(converter.sanitizer.sanitize).toHaveBeenCalledWith('test');
  });
});
