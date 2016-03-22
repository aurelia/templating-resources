'use strict';

System.register([], function (_export, _context) {
  var SCRIPT_REGEX, HTMLSanitizer;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [],
    execute: function () {
      SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

      _export('HTMLSanitizer', HTMLSanitizer = function () {
        function HTMLSanitizer() {
          _classCallCheck(this, HTMLSanitizer);
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