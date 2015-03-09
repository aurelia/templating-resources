import {SanitizeHtmlValueConverter} from '../src/sanitize-html';

describe('SanitizeHtmlValueConverter', () => {
  var converter;

  beforeEach(() => {
    converter = new SanitizeHtmlValueConverter();
  });

  it('defaultSanitizer should remove script tags', () => {
    var a = '<script src="http://www.evil.org"></script>',
        b = '<div><script src="http://www.evil.org"></script></div>',
        c = 'foo <script src="http://www.evil.org"></script> bar',
        d = '<div></div>',
        e = 'foo bar';

    expect(converter.toView('')).toBe('');
    expect(converter.toView(null)).toBe(null);
    expect(converter.toView(a)).toBe('');
    expect(converter.toView(b)).toBe('<div></div>');
    expect(converter.toView(c)).toBe('foo  bar');
    expect(converter.toView(d)).toBe('<div></div>');
    expect(converter.toView(e)).toBe('foo bar');
  });

  it('sanitizer should be the defaultSanitizer', () => {
    expect(converter.sanitizer).toBe(SanitizeHtmlValueConverter.defaultSanitizer);
  });

  it('custom sanitizers can be used', () => {
    var mockSanitizer = jasmine.createSpy('sanitizer spy');
    converter.sanitizer = mockSanitizer;
    converter.toView('test');
    expect(mockSanitizer).toHaveBeenCalledWith('test');
  });
});
