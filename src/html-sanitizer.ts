/**
 * Default Html Sanitizer to prevent script injection.
 */
export class HTMLSanitizer {
  /**
   * Sanitizes the provided input.
   * @param input The input to be sanitized.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sanitize(input): any {
    throw new Error(`To protect the application against a wide variety of sophisticated XSS attacks.
Please see https://aurelia.io/docs/binding/basics#element-content for instructions on how to use a secure solution like DOMPurify or sanitize-html.`);
  }
}
