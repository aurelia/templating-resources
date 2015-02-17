import {InnerHTML} from '../src/inner-html';

describe('An InnerHTML testing suite', () => {
  var element, behavior;

  beforeEach(() => {
    element = {
      innerHTML: ''
    };

    behavior = new InnerHTML(element);
  });

  it('should set the innerHTML property', () => {
    behavior.valueChanged('test');

    expect(element.innerHTML).toBe('test');
  });

  it('should call a custom sanitizer', () => {
    var mockSanitizer = jasmine.createSpy('sanitizer spy');

    behavior.sanitizerChanged(mockSanitizer);

    behavior.valueChanged('test');

    expect(mockSanitizer).toHaveBeenCalled();
  });

  it('should sanitize script tags by default', () => {
    behavior.valueChanged('test<script>var foo = "nefarious code"</script>');

    expect(element.innerHTML).toBe('test');
  });

  it('should pass the text to be sanitized', () => {
    var mockSanitizer = jasmine.createSpy('sanitizer spy');

    behavior.sanitizerChanged(mockSanitizer);

    behavior.valueChanged('test');

    expect(mockSanitizer).toHaveBeenCalledWith('test');
  });

  it('should set innerHTML to the output of the sanitizer', () => {
    var mockSanitizer = jasmine.createSpy('sanitizer spy').and.returnValue('output');

    behavior.sanitizerChanged(mockSanitizer);

    behavior.valueChanged('test');

    expect(element.innerHTML).toBe('output');
  });
});
