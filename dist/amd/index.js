define(['exports', './compose', './if', './with', './repeat', './show', './global-behavior', './sanitize-html'], function (exports, _compose, _if, _with, _repeat, _show, _globalBehavior, _sanitizeHtml) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  function install(aurelia) {
    aurelia.globalizeResources('./compose', './if', './with', './repeat', './show', './global-behavior', './sanitize-html');
  }

  exports.Compose = _compose.Compose;
  exports.If = _if.If;
  exports.With = _with.With;
  exports.Repeat = _repeat.Repeat;
  exports.Show = _show.Show;
  exports.SanitizeHtmlValueConverter = _sanitizeHtml.SanitizeHtmlValueConverter;
  exports.GlobalBehavior = _globalBehavior.GlobalBehavior;
  exports.install = install;
});