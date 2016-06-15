'use strict';

System.register([], function (_export, _context) {
  "use strict";

  var SCRIPT_REGEX, HTMLSanitizer;

  

  return {
    setters: [],
    execute: function () {
      SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

      _export('HTMLSanitizer', HTMLSanitizer = function () {
        function HTMLSanitizer() {
          
        }

        HTMLSanitizer.prototype.sanitize = function sanitize(input) {
          return input.replace(SCRIPT_REGEX, '');
        };

        return HTMLSanitizer;
      }());

      _export('HTMLSanitizer', HTMLSanitizer);
    }
  };
});