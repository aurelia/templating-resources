'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.viewsRequireLifecycle = exports.unwrapExpression = exports.updateOneTimeBinding = exports.isOneTime = exports.getItemsSourceExpression = exports.updateOverrideContext = exports.createFullOverrideContext = exports.NumberRepeatStrategy = exports.SetRepeatStrategy = exports.MapRepeatStrategy = exports.ArrayRepeatStrategy = exports.NullRepeatStrategy = exports.RepeatStrategyLocator = exports.AbstractRepeater = exports.UpdateTriggerBindingBehavior = exports.BindingSignaler = exports.SignalBindingBehavior = exports.SelfBindingBehavior = exports.DebounceBindingBehavior = exports.ThrottleBindingBehavior = exports.TwoWayBindingBehavior = exports.OneWayBindingBehavior = exports.OneTimeBindingBehavior = exports.AttrBindingBehavior = exports.configure = exports.Focus = exports.Replaceable = exports.SanitizeHTMLValueConverter = exports.HTMLSanitizer = exports.Hide = exports.Show = exports.Repeat = exports.With = exports.If = exports.Compose = undefined;

var _aureliaPal = require('aurelia-pal');

var _compose = require('./compose');

var _if = require('./if');

var _with = require('./with');

var _repeat = require('./repeat');

var _show = require('./show');

var _hide = require('./hide');

var _sanitizeHtml = require('./sanitize-html');

var _replaceable = require('./replaceable');

var _focus = require('./focus');

var _aureliaTemplating = require('aurelia-templating');

var _cssResource = require('./css-resource');

var _htmlSanitizer = require('./html-sanitizer');

var _attrBindingBehavior = require('./attr-binding-behavior');

var _bindingModeBehaviors = require('./binding-mode-behaviors');

var _throttleBindingBehavior = require('./throttle-binding-behavior');

var _debounceBindingBehavior = require('./debounce-binding-behavior');

var _selfBindingBehavior = require('./self-binding-behavior');

var _signalBindingBehavior = require('./signal-binding-behavior');

var _bindingSignaler = require('./binding-signaler');

var _updateTriggerBindingBehavior = require('./update-trigger-binding-behavior');

var _abstractRepeater = require('./abstract-repeater');

var _repeatStrategyLocator = require('./repeat-strategy-locator');

var _htmlResourcePlugin = require('./html-resource-plugin');

var _nullRepeatStrategy = require('./null-repeat-strategy');

var _arrayRepeatStrategy = require('./array-repeat-strategy');

var _mapRepeatStrategy = require('./map-repeat-strategy');

var _setRepeatStrategy = require('./set-repeat-strategy');

var _numberRepeatStrategy = require('./number-repeat-strategy');

var _repeatUtilities = require('./repeat-utilities');

var _analyzeViewFactory = require('./analyze-view-factory');

var _aureliaHideStyle = require('./aurelia-hide-style');

function configure(config) {
  (0, _aureliaHideStyle.injectAureliaHideStyleAtHead)();

  config.globalResources(_aureliaPal.PLATFORM.moduleName('./compose'), _aureliaPal.PLATFORM.moduleName('./if'), _aureliaPal.PLATFORM.moduleName('./with'), _aureliaPal.PLATFORM.moduleName('./repeat'), _aureliaPal.PLATFORM.moduleName('./show'), _aureliaPal.PLATFORM.moduleName('./hide'), _aureliaPal.PLATFORM.moduleName('./replaceable'), _aureliaPal.PLATFORM.moduleName('./sanitize-html'), _aureliaPal.PLATFORM.moduleName('./focus'), _aureliaPal.PLATFORM.moduleName('./binding-mode-behaviors'), _aureliaPal.PLATFORM.moduleName('./self-binding-behavior'), _aureliaPal.PLATFORM.moduleName('./throttle-binding-behavior'), _aureliaPal.PLATFORM.moduleName('./debounce-binding-behavior'), _aureliaPal.PLATFORM.moduleName('./signal-binding-behavior'), _aureliaPal.PLATFORM.moduleName('./update-trigger-binding-behavior'), _aureliaPal.PLATFORM.moduleName('./attr-binding-behavior'));

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