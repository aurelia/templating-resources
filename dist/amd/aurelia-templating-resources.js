define(['exports', './compose', './if', './else', './with', './repeat', './show', './hide', './sanitize-html', './replaceable', './focus', 'aurelia-templating', './css-resource', './html-sanitizer', './attr-binding-behavior', './binding-mode-behaviors', './throttle-binding-behavior', './debounce-binding-behavior', './self-binding-behavior', './signal-binding-behavior', './binding-signaler', './update-trigger-binding-behavior', './abstract-repeater', './repeat-strategy-locator', './html-resource-plugin', './null-repeat-strategy', './array-repeat-strategy', './map-repeat-strategy', './set-repeat-strategy', './number-repeat-strategy', './repeat-utilities', './analyze-view-factory', './aurelia-hide-style'], function (exports, _compose, _if, _else, _with, _repeat, _show, _hide, _sanitizeHtml, _replaceable, _focus, _aureliaTemplating, _cssResource, _htmlSanitizer, _attrBindingBehavior, _bindingModeBehaviors, _throttleBindingBehavior, _debounceBindingBehavior, _selfBindingBehavior, _signalBindingBehavior, _bindingSignaler, _updateTriggerBindingBehavior, _abstractRepeater, _repeatStrategyLocator, _htmlResourcePlugin, _nullRepeatStrategy, _arrayRepeatStrategy, _mapRepeatStrategy, _setRepeatStrategy, _numberRepeatStrategy, _repeatUtilities, _analyzeViewFactory, _aureliaHideStyle) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.viewsRequireLifecycle = exports.unwrapExpression = exports.updateOneTimeBinding = exports.isOneTime = exports.getItemsSourceExpression = exports.updateOverrideContext = exports.createFullOverrideContext = exports.NumberRepeatStrategy = exports.SetRepeatStrategy = exports.MapRepeatStrategy = exports.ArrayRepeatStrategy = exports.NullRepeatStrategy = exports.RepeatStrategyLocator = exports.AbstractRepeater = exports.UpdateTriggerBindingBehavior = exports.BindingSignaler = exports.SignalBindingBehavior = exports.SelfBindingBehavior = exports.DebounceBindingBehavior = exports.ThrottleBindingBehavior = exports.TwoWayBindingBehavior = exports.FromViewBindingBehavior = exports.ToViewBindingBehavior = exports.OneWayBindingBehavior = exports.OneTimeBindingBehavior = exports.AttrBindingBehavior = exports.configure = exports.Focus = exports.Replaceable = exports.SanitizeHTMLValueConverter = exports.HTMLSanitizer = exports.Hide = exports.Show = exports.Repeat = exports.With = exports.Else = exports.If = exports.Compose = undefined;


  function configure(config) {
    (0, _aureliaHideStyle.injectAureliaHideStyleAtHead)();

    config.globalResources(_compose.Compose, _if.If, _else.Else, _with.With, _repeat.Repeat, _show.Show, _hide.Hide, _replaceable.Replaceable, _focus.Focus, _sanitizeHtml.SanitizeHTMLValueConverter, _bindingModeBehaviors.OneTimeBindingBehavior, _bindingModeBehaviors.OneWayBindingBehavior, _bindingModeBehaviors.ToViewBindingBehavior, _bindingModeBehaviors.FromViewBindingBehavior, _bindingModeBehaviors.TwoWayBindingBehavior, _throttleBindingBehavior.ThrottleBindingBehavior, _debounceBindingBehavior.DebounceBindingBehavior, _selfBindingBehavior.SelfBindingBehavior, _signalBindingBehavior.SignalBindingBehavior, _updateTriggerBindingBehavior.UpdateTriggerBindingBehavior, _attrBindingBehavior.AttrBindingBehavior);

    (0, _htmlResourcePlugin.configure)(config);

    var viewEngine = config.container.get(_aureliaTemplating.ViewEngine);
    var styleResourcePlugin = {
      fetch: function fetch(address) {
        var _ref;

        return _ref = {}, _ref[address] = (0, _cssResource._createCSSResource)(address), _ref;
      }
    };
    ['.css', '.less', '.sass', '.scss', '.styl'].forEach(function (ext) {
      return viewEngine.addResourcePlugin(ext, styleResourcePlugin);
    });
  }

  exports.Compose = _compose.Compose;
  exports.If = _if.If;
  exports.Else = _else.Else;
  exports.With = _with.With;
  exports.Repeat = _repeat.Repeat;
  exports.Show = _show.Show;
  exports.Hide = _hide.Hide;
  exports.HTMLSanitizer = _htmlSanitizer.HTMLSanitizer;
  exports.SanitizeHTMLValueConverter = _sanitizeHtml.SanitizeHTMLValueConverter;
  exports.Replaceable = _replaceable.Replaceable;
  exports.Focus = _focus.Focus;
  exports.configure = configure;
  exports.AttrBindingBehavior = _attrBindingBehavior.AttrBindingBehavior;
  exports.OneTimeBindingBehavior = _bindingModeBehaviors.OneTimeBindingBehavior;
  exports.OneWayBindingBehavior = _bindingModeBehaviors.OneWayBindingBehavior;
  exports.ToViewBindingBehavior = _bindingModeBehaviors.ToViewBindingBehavior;
  exports.FromViewBindingBehavior = _bindingModeBehaviors.FromViewBindingBehavior;
  exports.TwoWayBindingBehavior = _bindingModeBehaviors.TwoWayBindingBehavior;
  exports.ThrottleBindingBehavior = _throttleBindingBehavior.ThrottleBindingBehavior;
  exports.DebounceBindingBehavior = _debounceBindingBehavior.DebounceBindingBehavior;
  exports.SelfBindingBehavior = _selfBindingBehavior.SelfBindingBehavior;
  exports.SignalBindingBehavior = _signalBindingBehavior.SignalBindingBehavior;
  exports.BindingSignaler = _bindingSignaler.BindingSignaler;
  exports.UpdateTriggerBindingBehavior = _updateTriggerBindingBehavior.UpdateTriggerBindingBehavior;
  exports.AbstractRepeater = _abstractRepeater.AbstractRepeater;
  exports.RepeatStrategyLocator = _repeatStrategyLocator.RepeatStrategyLocator;
  exports.NullRepeatStrategy = _nullRepeatStrategy.NullRepeatStrategy;
  exports.ArrayRepeatStrategy = _arrayRepeatStrategy.ArrayRepeatStrategy;
  exports.MapRepeatStrategy = _mapRepeatStrategy.MapRepeatStrategy;
  exports.SetRepeatStrategy = _setRepeatStrategy.SetRepeatStrategy;
  exports.NumberRepeatStrategy = _numberRepeatStrategy.NumberRepeatStrategy;
  exports.createFullOverrideContext = _repeatUtilities.createFullOverrideContext;
  exports.updateOverrideContext = _repeatUtilities.updateOverrideContext;
  exports.getItemsSourceExpression = _repeatUtilities.getItemsSourceExpression;
  exports.isOneTime = _repeatUtilities.isOneTime;
  exports.updateOneTimeBinding = _repeatUtilities.updateOneTimeBinding;
  exports.unwrapExpression = _repeatUtilities.unwrapExpression;
  exports.viewsRequireLifecycle = _analyzeViewFactory.viewsRequireLifecycle;
});