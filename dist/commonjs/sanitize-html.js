'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SanitizeHTMLValueConverter = undefined;

var _dec, _dec2, _class;

var _aureliaBinding = require('aurelia-binding');

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _htmlSanitizer = require('./html-sanitizer');



var SanitizeHTMLValueConverter = exports.SanitizeHTMLValueConverter = (_dec = (0, _aureliaBinding.valueConverter)('sanitizeHTML'), _dec2 = (0, _aureliaDependencyInjection.inject)(_htmlSanitizer.HTMLSanitizer), _dec(_class = _dec2(_class = function () {
  function SanitizeHTMLValueConverter(sanitizer) {
    

    this.sanitizer = sanitizer;
  }

  SanitizeHTMLValueConverter.prototype.toView = function toView(untrustedMarkup) {
    if (untrustedMarkup === null || untrustedMarkup === undefined) {
      return null;
    }

    return this.sanitizer.sanitize(untrustedMarkup);
  };

  return SanitizeHTMLValueConverter;
}()) || _class) || _class);