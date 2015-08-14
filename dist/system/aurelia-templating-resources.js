System.register(['./compose', './if', './with', './repeat', './show', './global-behavior', './sanitize-html', './replaceable', './focus', './compile-spy', './view-spy'], function (_export) {
  'use strict';

  var Compose, If, With, Repeat, Show, GlobalBehavior, SanitizeHtmlValueConverter, Replaceable, Focus, CompileSpy, ViewSpy;

  function configure(config) {
    config.globalResources('./compose', './if', './with', './repeat', './show', './replaceable', './global-behavior', './sanitize-html', './focus', './compile-spy', './view-spy');
  }

  return {
    setters: [function (_compose) {
      Compose = _compose.Compose;
    }, function (_if) {
      If = _if.If;
    }, function (_with) {
      With = _with.With;
    }, function (_repeat) {
      Repeat = _repeat.Repeat;
    }, function (_show) {
      Show = _show.Show;
    }, function (_globalBehavior) {
      GlobalBehavior = _globalBehavior.GlobalBehavior;
    }, function (_sanitizeHtml) {
      SanitizeHtmlValueConverter = _sanitizeHtml.SanitizeHtmlValueConverter;
    }, function (_replaceable) {
      Replaceable = _replaceable.Replaceable;
    }, function (_focus) {
      Focus = _focus.Focus;
    }, function (_compileSpy) {
      CompileSpy = _compileSpy.CompileSpy;
    }, function (_viewSpy) {
      ViewSpy = _viewSpy.ViewSpy;
    }],
    execute: function () {
      _export('Compose', Compose);

      _export('If', If);

      _export('With', With);

      _export('Repeat', Repeat);

      _export('Show', Show);

      _export('SanitizeHtmlValueConverter', SanitizeHtmlValueConverter);

      _export('GlobalBehavior', GlobalBehavior);

      _export('Replaceable', Replaceable);

      _export('Focus', Focus);

      _export('CompileSpy', CompileSpy);

      _export('ViewSpy', ViewSpy);

      _export('configure', configure);
    }
  };
});