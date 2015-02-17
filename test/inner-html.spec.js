import {InnerHTML} from '../src/inner-html';

describe('The InnerHTML behavior', () => {
  var element, behavior, defaultSanitizer;

  beforeEach(() => {
    defaultSanitizer = InnerHTML.defaultSanitizer;

    element = {
      innerHTML: ''
    };

    behavior = new InnerHTML(element);
  });

  afterEach(() => {
    InnerHTML.defaultSanitizer = defaultSanitizer;
  });

  it('should set the innerHTML property', () => {
    behavior.valueChanged('test');

    expect(element.innerHTML).toBe('test');
  });

  it('should call a global custom sanitizer', () => {

    var mockSanitizer = jasmine.createSpy('sanitizer spy');

    InnerHTML.defaultSanitizer = mockSanitizer;

    behavior = new InnerHTML(element);

    behavior.valueChanged('test');

    expect(mockSanitizer).toHaveBeenCalled();
  });

  it('should call a custom sanitizer', () => {
    var mockSanitizer = jasmine.createSpy('sanitizer spy');

    behavior.sanitizer = mockSanitizer;

    behavior.valueChanged('test');

    expect(mockSanitizer).toHaveBeenCalled();
  });

  it('should sanitize script tags by default', () => {
    behavior.valueChanged('test<script>var foo = "nefarious code"</script>');

    expect(element.innerHTML).toBe('test');
  });

  it('should pass the text to be sanitized', () => {
    var mockSanitizer = jasmine.createSpy('sanitizer spy');

    behavior.sanitizer = mockSanitizer;

    behavior.valueChanged('test');

    expect(mockSanitizer).toHaveBeenCalledWith('test');
  });

  it('should set innerHTML to the output of the sanitizer', () => {
    var mockSanitizer = jasmine.createSpy('sanitizer spy').and.returnValue('output');

    behavior.sanitizer = mockSanitizer;

    behavior.valueChanged('test');

    expect(element.innerHTML).toBe('output');
  });
});
