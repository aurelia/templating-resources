'use strict';

exports.__esModule = true;

var _Compose = require('./compose');

var _If = require('./if');

var _With = require('./with');

var _Repeat = require('./repeat');

var _Show = require('./show');

var _GlobalBehavior = require('./global-behavior');

var _SanitizeHtmlValueConverter = require('./sanitize-html');

function configure(aurelia) {
  aurelia.globalizeResources('./compose', './if', './with', './repeat', './show', './global-behavior', './sanitize-html');
}

exports.Compose = _Compose.Compose;
exports.If = _If.If;
exports.With = _With.With;
exports.Repeat = _Repeat.Repeat;
exports.Show = _Show.Show;
exports.SanitizeHtmlValueConverter = _SanitizeHtmlValueConverter.SanitizeHtmlValueConverter;
exports.GlobalBehavior = _GlobalBehavior.GlobalBehavior;
exports.configure = configure;