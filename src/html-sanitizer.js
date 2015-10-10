const SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

/**
* Default Html Sanitizer to prevent script injection.
*/
export class HTMLSanitizer {
  sanitize(input) {
    return input.replace(SCRIPT_REGEX, '');
  }
}
