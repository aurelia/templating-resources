'use strict';

System.register(['./compose', './if', './with', './repeat', './show', './hide', './sanitize-html', './replaceable', './focus', './compile-spy', './view-spy', 'aurelia-templating', './css-resource', 'aurelia-pal', './html-sanitizer', './binding-mode-behaviors', './throttle-binding-behavior', './debounce-binding-behavior', './signal-binding-behavior', './binding-signaler', './update-trigger-binding-behavior', './abstract-repeater', './repeat-strategy-locator', './html-resource-plugin', './null-repeat-strategy', './array-repeat-strategy', './map-repeat-strategy', './set-repeat-strategy', './number-repeat-strategy'], function (_export, _context) {
  var Compose, If, With, Repeat, Show, Hide, SanitizeHTMLValueConverter, Replaceable, Focus, CompileSpy, ViewSpy, ViewEngine, _createCSSResource, FEATURE, DOM, HTMLSanitizer, OneTimeBindingBehavior, OneWayBindingBehavior, TwoWayBindingBehavior, ThrottleBindingBehavior, DebounceBindingBehavior, SignalBindingBehavior, BindingSignaler, UpdateTriggerBindingBehavior, AbstractRepeater, RepeatStrategyLocator, configureHtmlResourcePlugin, NullRepeatStrategy, ArrayRepeatStrategy, MapRepeatStrategy, SetRepeatStrategy, NumberRepeatStrategy;

  function configure(config) {
    if (FEATURE.shadowDOM) {
      DOM.injectStyles('body /deep/ .aurelia-hide { display:none !important; }');
    } else {
      DOM.injectStyles('.aurelia-hide { display:none !important; }');
    }

    config.globalResources('./compose', './if', './with', './repeat', './show', './hide', './replaceable', './sanitize-html', './focus', './compile-spy', './view-spy', './binding-mode-behaviors', './throttle-binding-behavior', './debounce-binding-behavior', './signal-binding-behavior', './update-trigger-binding-behavior');

    configureHtmlResourcePlugin(config);

    var viewEngine = config.container.get(ViewEngine);
    viewEngine.addResourcePlugin('.css', {
      'fetch': function fetch(address) {
        var _ref;

        return _ref = {}, _ref[address] = _createCSSResource(address), _ref;
      }
    });
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
    }, function (_hide) {
      Hide = _hide.Hide;
    }, function (_sanitizeHtml) {
      SanitizeHTMLValueConverter = _sanitizeHtml.SanitizeHTMLValueConverter;
    }, function (_replaceable) {
      Replaceable = _replaceable.Replaceable;
    }, function (_focus) {
      Focus = _focus.Focus;
    }, function (_compileSpy) {
      CompileSpy = _compileSpy.CompileSpy;
    }, function (_viewSpy) {
      ViewSpy = _viewSpy.ViewSpy;
    }, function (_aureliaTemplating) {
      ViewEngine = _aureliaTemplating.ViewEngine;
    }, function (_cssResource) {
      _createCSSResource = _cssResource._createCSSResource;
    }, function (_aureliaPal) {
      FEATURE = _aureliaPal.FEATURE;
      DOM = _aureliaPal.DOM;
    }, function (_htmlSanitizer) {
      HTMLSanitizer = _htmlSanitizer.HTMLSanitizer;
    }, function (_bindingModeBehaviors) {
      OneTimeBindingBehavior = _bindingModeBehaviors.OneTimeBindingBehavior;
      OneWayBindingBehavior = _bindingModeBehaviors.OneWayBindingBehavior;
      TwoWayBindingBehavior = _bindingModeBehaviors.TwoWayBindingBehavior;
    }, function (_throttleBindingBehavior) {
      ThrottleBindingBehavior = _throttleBindingBehavior.ThrottleBindingBehavior;
    }, function (_debounceBindingBehavior) {
      DebounceBindingBehavior = _debounceBindingBehavior.DebounceBindingBehavior;
    }, function (_signalBindingBehavior) {
      SignalBindingBehavior = _signalBindingBehavior.SignalBindingBehavior;
    }, function (_bindingSignaler) {
      BindingSignaler = _bindingSignaler.BindingSignaler;
    }, function (_updateTriggerBindingBehavior) {
      UpdateTriggerBindingBehavior = _updateTriggerBindingBehavior.UpdateTriggerBindingBehavior;
    }, function (_abstractRepeater) {
      AbstractRepeater = _abstractRepeater.AbstractRepeater;
    }, function (_repeatStrategyLocator) {
      RepeatStrategyLocator = _repeatStrategyLocator.RepeatStrategyLocator;
    }, function (_htmlResourcePlugin) {
      configureHtmlResourcePlugin = _htmlResourcePlugin.configure;
    }, function (_nullRepeatStrategy) {
      NullRepeatStrategy = _nullRepeatStrategy.NullRepeatStrategy;
    }, function (_arrayRepeatStrategy) {
      ArrayRepeatStrategy = _arrayRepeatStrategy.ArrayRepeatStrategy;
    }, function (_mapRepeatStrategy) {
      MapRepeatStrategy = _mapRepeatStrategy.MapRepeatStrategy;
    }, function (_setRepeatStrategy) {
      SetRepeatStrategy = _setRepeatStrategy.SetRepeatStrategy;
    }, function (_numberRepeatStrategy) {
      NumberRepeatStrategy = _numberRepeatStrategy.NumberRepeatStrategy;
    }],
    execute: function () {
      _export('Compose', Compose);

      _export('If', If);

      _export('With', With);

      _export('Repeat', Repeat);

      _export('Show', Show);

      _export('Hide', Hide);

      _export('HTMLSanitizer', HTMLSanitizer);

      _export('SanitizeHTMLValueConverter', SanitizeHTMLValueConverter);

      _export('Replaceable', Replaceable);

      _export('Focus', Focus);

      _export('CompileSpy', CompileSpy);

      _export('ViewSpy', ViewSpy);

      _export('configure', configure);

      _export('OneTimeBindingBehavior', OneTimeBindingBehavior);

      _export('OneWayBindingBehavior', OneWayBindingBehavior);

      _export('TwoWayBindingBehavior', TwoWayBindingBehavior);

      _export('ThrottleBindingBehavior', ThrottleBindingBehavior);

      _export('DebounceBindingBehavior', DebounceBindingBehavior);

      _export('SignalBindingBehavior', SignalBindingBehavior);

      _export('BindingSignaler', BindingSignaler);

      _export('UpdateTriggerBindingBehavior', UpdateTriggerBindingBehavior);

      _export('AbstractRepeater', AbstractRepeater);

      _export('RepeatStrategyLocator', RepeatStrategyLocator);

      _export('NullRepeatStrategy', NullRepeatStrategy);

      _export('ArrayRepeatStrategy', ArrayRepeatStrategy);

      _export('MapRepeatStrategy', MapRepeatStrategy);

      _export('SetRepeatStrategy', SetRepeatStrategy);

      _export('NumberRepeatStrategy', NumberRepeatStrategy);
    }
  };
});