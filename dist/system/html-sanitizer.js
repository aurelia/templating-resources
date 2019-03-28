'use strict';

System.register(['aurelia-logging'], function (_export, _context) {
  "use strict";

  var getLogger, SCRIPT_REGEX, needsToWarn, HTMLSanitizer;

  

  return {
    setters: [function (_aureliaLogging) {
      getLogger = _aureliaLogging.getLogger;
    }],
    execute: function () {
      SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
      needsToWarn = true;

      _export('HTMLSanitizer', HTMLSanitizer = function () {
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
      }());

      _export('HTMLSanitizer', HTMLSanitizer);
    }
  };
});