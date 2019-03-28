

import { getLogger } from 'aurelia-logging';

var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
var needsToWarn = true;

export var HTMLSanitizer = function () {
  function HTMLSanitizer() {
    
  }

  HTMLSanitizer.prototype.sanitize = function sanitize(input) {
    if (needsToWarn) {
      needsToWarn = false;

      getLogger('html-sanitizer').warn('CAUTION: The default HTMLSanitizer does NOT provide security against a wide variety of sophisticated XSS attacks,\n        and should not be relied on for sanitizing input from unknown sources.\n        Please see https://aurelia.io/docs/binding/basics#element-content for instructions on how to use a secure solution like DOMPurify or sanitize-html.');
    }

    return input.replace(SCRIPT_REGEX, '');
  };

  return HTMLSanitizer;
}();