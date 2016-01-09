System.register(['./compose', './if', './with', './repeat', './show', './sanitize-html', './replaceable', './focus', './compile-spy', './view-spy', 'aurelia-templating', './dynamic-element', './css-resource', 'aurelia-pal', './html-sanitizer', './binding-mode-behaviors', './throttle-binding-behavior', './debounce-binding-behavior', './signal-binding-behavior', './binding-signaler', './update-trigger-binding-behavior'], function (_export) {
  'use strict';

  var Compose, If, With, Repeat, Show, SanitizeHTMLValueConverter, Replaceable, Focus, CompileSpy, ViewSpy, ViewEngine, _createDynamicElement, _createCSSResource, FEATURE, DOM, HTMLSanitizer, OneTimeBindingBehavior, OneWayBindingBehavior, TwoWayBindingBehavior, ThrottleBindingBehavior, DebounceBindingBehavior, SignalBindingBehavior, BindingSignaler, UpdateTriggerBindingBehavior;

  function configure(config) {
    if (FEATURE.shadowDOM) {
      DOM.injectStyles('body /deep/ .aurelia-hide { display:none !important; }');
    } else {
      DOM.injectStyles('.aurelia-hide { display:none !important; }');
    }

    config.globalResources('./compose', './if', './with', './repeat', './show', './replaceable', './sanitize-html', './focus', './compile-spy', './view-spy', './binding-mode-behaviors', './throttle-binding-behavior', './debounce-binding-behavior', './signal-binding-behavior', './update-trigger-binding-behavior');

    var viewEngine = config.container.get(ViewEngine);
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

          return _ref = {}, _ref[elementName] = _createDynamicElement(elementName, address, bindable), _ref;
        });
      }
    });

    viewEngine.addResourcePlugin('.css', {
      'fetch': function fetch(address) {
        var _ref2;

        return _ref2 = {}, _ref2[address] = _createCSSResource(address), _ref2;
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
    }, function (_dynamicElement) {
      _createDynamicElement = _dynamicElement._createDynamicElement;
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
    }],
    execute: function () {
      _export('Compose', Compose);

      _export('If', If);

      _export('With', With);

      _export('Repeat', Repeat);

      _export('Show', Show);

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
    }
  };
});