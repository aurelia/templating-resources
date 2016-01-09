'use strict';

exports.__esModule = true;

var _compose = require('./compose');

var _if = require('./if');

var _with = require('./with');

var _repeat = require('./repeat');

var _show = require('./show');

var _sanitizeHtml = require('./sanitize-html');

var _replaceable = require('./replaceable');

var _focus = require('./focus');

var _compileSpy = require('./compile-spy');

var _viewSpy = require('./view-spy');

var _aureliaTemplating = require('aurelia-templating');

var _dynamicElement = require('./dynamic-element');

var _cssResource = require('./css-resource');

var _aureliaPal = require('aurelia-pal');

var _htmlSanitizer = require('./html-sanitizer');

var _bindingModeBehaviors = require('./binding-mode-behaviors');

var _throttleBindingBehavior = require('./throttle-binding-behavior');

var _debounceBindingBehavior = require('./debounce-binding-behavior');

var _signalBindingBehavior = require('./signal-binding-behavior');

var _bindingSignaler = require('./binding-signaler');

var _updateTriggerBindingBehavior = require('./update-trigger-binding-behavior');

function configure(config) {
  if (_aureliaPal.FEATURE.shadowDOM) {
    _aureliaPal.DOM.injectStyles('body /deep/ .aurelia-hide { display:none !important; }');
  } else {
    _aureliaPal.DOM.injectStyles('.aurelia-hide { display:none !important; }');
  }

  config.globalResources('./compose', './if', './with', './repeat', './show', './replaceable', './sanitize-html', './focus', './compile-spy', './view-spy', './binding-mode-behaviors', './throttle-binding-behavior', './debounce-binding-behavior', './signal-binding-behavior', './update-trigger-binding-behavior');

  var viewEngine = config.container.get(_aureliaTemplating.ViewEngine);
  var loader = config.aurelia.loader;

  viewEngine.addResourcePlugin('.html', {
    'fetch': function fetch(address) {
      return loader.loadTemplate(address).then(function (registryEntry) {
        var _ref;

        var bindable = registryEntry.template.getAttribute('bindable');
        var elementName = address.replace('.html', '');
        var index = elementName.lastIndexOf('/');

        if (index !== 0) {
          elementName = elementName.substring(index + 1);
        }

        if (bindable) {
          bindable = bindable.split(',').map(function (x) {
            return x.trim();
          });
          registryEntry.template.removeAttribute('bindable');
        } else {
          bindable = [];
        }

        return _ref = {}, _ref[elementName] = _dynamicElement._createDynamicElement(elementName, address, bindable), _ref;
      });
    }
  });

  viewEngine.addResourcePlugin('.css', {
    'fetch': function fetch(address) {
      var _ref2;

      return _ref2 = {}, _ref2[address] = _cssResource._createCSSResource(address), _ref2;
    }
  });
}

exports.Compose = _compose.Compose;
exports.If = _if.If;
exports.With = _with.With;
exports.Repeat = _repeat.Repeat;
exports.Show = _show.Show;
exports.HTMLSanitizer = _htmlSanitizer.HTMLSanitizer;
exports.SanitizeHTMLValueConverter = _sanitizeHtml.SanitizeHTMLValueConverter;
exports.Replaceable = _replaceable.Replaceable;
exports.Focus = _focus.Focus;
exports.CompileSpy = _compileSpy.CompileSpy;
exports.ViewSpy = _viewSpy.ViewSpy;
exports.configure = configure;
exports.OneTimeBindingBehavior = _bindingModeBehaviors.OneTimeBindingBehavior;
exports.OneWayBindingBehavior = _bindingModeBehaviors.OneWayBindingBehavior;
exports.TwoWayBindingBehavior = _bindingModeBehaviors.TwoWayBindingBehavior;
exports.ThrottleBindingBehavior = _throttleBindingBehavior.ThrottleBindingBehavior;
exports.DebounceBindingBehavior = _debounceBindingBehavior.DebounceBindingBehavior;
exports.SignalBindingBehavior = _signalBindingBehavior.SignalBindingBehavior;
exports.BindingSignaler = _bindingSignaler.BindingSignaler;
exports.UpdateTriggerBindingBehavior = _updateTriggerBindingBehavior.UpdateTriggerBindingBehavior;