define(['exports', 'aurelia-logging'], function (exports, _aureliaLogging) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.HTMLSanitizer = undefined;

  

  var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  var needsToWarn = true;

  var HTMLSanitizer = exports.HTMLSanitizer = function () {
    function HTMLSanitizer() {
      
    }

    HTMLSanitizer.prototype.sanitize = function sanitize(input) {
      if (needsToWarn) {
        needsToWarn = false;

        (0, _aureliaLogging.getLogger)('html-sanitizer').warn('CAUTION: The default HTMLSanitizer does NOT provide security against a wide variety of sophisticated XSS attacks,\n        and should not be relied on for sanitizing input from unknown sources.\n        Please see https://aurelia.io/docs/binding/basics#element-content for instructions on how to use a secure solution like DOMPurify or sanitize-html.');
      }

      return input.replace(SCRIPT_REGEX, '');
    };

    return HTMLSanitizer;
  }();
});