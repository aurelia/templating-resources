'use strict';

System.register(['./compose', './if', './with', './repeat', './show', './hide', './sanitize-html', './replaceable', './focus', 'aurelia-templating', './css-resource', './html-sanitizer', './attr-binding-behavior', './binding-mode-behaviors', './throttle-binding-behavior', './debounce-binding-behavior', './signal-binding-behavior', './binding-signaler', './update-trigger-binding-behavior', './abstract-repeater', './repeat-strategy-locator', './html-resource-plugin', './null-repeat-strategy', './array-repeat-strategy', './map-repeat-strategy', './set-repeat-strategy', './number-repeat-strategy', './repeat-utilities', './analyze-view-factory', './aurelia-hide-style'], function (_export, _context) {
  "use strict";

  var Compose, If, With, Repeat, Show, Hide, SanitizeHTMLValueConverter, Replaceable, Focus, ViewEngine, _createCSSResource, HTMLSanitizer, AttrBindingBehavior, OneTimeBindingBehavior, OneWayBindingBehavior, TwoWayBindingBehavior, ThrottleBindingBehavior, DebounceBindingBehavior, SignalBindingBehavior, BindingSignaler, UpdateTriggerBindingBehavior, AbstractRepeater, RepeatStrategyLocator, configureHtmlResourcePlugin, NullRepeatStrategy, ArrayRepeatStrategy, MapRepeatStrategy, SetRepeatStrategy, NumberRepeatStrategy, createFullOverrideContext, updateOverrideContext, getItemsSourceExpression, isOneTime, updateOneTimeBinding, unwrapExpression, viewsRequireLifecycle, injectAureliaHideStyleAtHead;

  function configure(config) {
    injectAureliaHideStyleAtHead();

    config.globalResources('./compose', './if', './with', './repeat', './show', './hide', './replaceable', './sanitize-html', './focus', './binding-mode-behaviors', './throttle-binding-behavior', './debounce-binding-behavior', './signal-binding-behavior', './update-trigger-binding-behavior', './attr-binding-behavior');

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
    }, function (_aureliaTemplating) {
      ViewEngine = _aureliaTemplating.ViewEngine;
    }, function (_cssResource) {
      _createCSSResource = _cssResource._createCSSResource;
    }, function (_htmlSanitizer) {
      HTMLSanitizer = _htmlSanitizer.HTMLSanitizer;
    }, function (_attrBindingBehavior) {
      AttrBindingBehavior = _attrBindingBehavior.AttrBindingBehavior;
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
    }, function (_repeatUtilities) {
      createFullOverrideContext = _repeatUtilities.createFullOverrideContext;
      updateOverrideContext = _repeatUtilities.updateOverrideContext;
      getItemsSourceExpression = _repeatUtilities.getItemsSourceExpression;
      isOneTime = _repeatUtilities.isOneTime;
      updateOneTimeBinding = _repeatUtilities.updateOneTimeBinding;
      unwrapExpression = _repeatUtilities.unwrapExpression;
    }, function (_analyzeViewFactory) {
      viewsRequireLifecycle = _analyzeViewFactory.viewsRequireLifecycle;
    }, function (_aureliaHideStyle) {
      injectAureliaHideStyleAtHead = _aureliaHideStyle.injectAureliaHideStyleAtHead;
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

      _export('configure', configure);

      _export('AttrBindingBehavior', AttrBindingBehavior);

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

      _export('createFullOverrideContext', createFullOverrideContext);

      _export('updateOverrideContext', updateOverrideContext);

      _export('getItemsSourceExpression', getItemsSourceExpression);

      _export('isOneTime', isOneTime);

      _export('updateOneTimeBinding', updateOneTimeBinding);

      _export('unwrapExpression', unwrapExpression);

      _export('viewsRequireLifecycle', viewsRequireLifecycle);
    }
  };
});