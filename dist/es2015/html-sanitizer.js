const SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

export let HTMLSanitizer = class HTMLSanitizer {
  sanitize(input) {
    return input.replace(SCRIPT_REGEX, '');
  }
};