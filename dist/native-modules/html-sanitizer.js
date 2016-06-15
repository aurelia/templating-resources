

var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

export var HTMLSanitizer = function () {
  function HTMLSanitizer() {
    
  }

  HTMLSanitizer.prototype.sanitize = function sanitize(input) {
    return input.replace(SCRIPT_REGEX, '');
  };

  return HTMLSanitizer;
}();