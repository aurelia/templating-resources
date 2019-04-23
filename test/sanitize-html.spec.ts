import './setup';
import {SanitizeHTMLValueConverter} from '../src/sanitize-html';
import {HTMLSanitizer} from '../src/html-sanitizer';

describe('SanitizeHtmlValueConverter', () => {
  var converter;

  beforeEach(() => {
    converter = new SanitizeHTMLValueConverter(new HTMLSanitizer());
  });

  it('defaultSanitizer should remove script tags', () => {
    var a = '<script src="http://www.evil.org"></script>',
        b = '<div><script src="http://www.evil.org"></script></div>',
        c = 'foo <script src="http://www.evil.org"></script> bar',
        d = '<div></div>',
        e = 'foo bar';

    expect(converter.toView('')).toBe('');
    expect(converter.toView(null)).toBe(null);
    expect(converter.toView(undefined)).toBe(null);
    expect(converter.toView(a)).toBe('');
    expect(converter.toView(b)).toBe('<div></div>');
    expect(converter.toView(c)).toBe('foo  bar');
    expect(converter.toView(d)).toBe('<div></div>');
    expect(converter.toView(e)).toBe('foo bar');
  });

  it('custom sanitizers can be used', () => {
    spyOn(converter.sanitizer, 'sanitize');
    converter.toView('test');
    expect(converter.sanitizer.sanitize).toHaveBeenCalledWith('test');
  });
});
