import { getLogger } from 'aurelia-logging';

const SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

/**
* Default Html Sanitizer to prevent script injection.
*/
export class HTMLSanitizer {
  constructor() {
    getLogger('html-sanitizer')
      .warn(`CAUTION: The default HTMLSanitizer does NOT provide security against a wide variety of sophisticated XSS attacks,
      and should not be relied on for sanitizing input from unknown sources.
      Please see https://aurelia.io/docs/binding/basics#element-content for instructions on how to use a secure solution like DOMPurify or sanitize-html.`);
  }

  /**
  * Sanitizes the provided input.
  * @param input The input to be sanitized.
  */
  sanitize(input) {
    return input.replace(SCRIPT_REGEX, '');
  }
}
