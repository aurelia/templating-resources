System.register(['./compose', './if', './with', './repeat', './show', './global-behavior', './sanitize-html', './replaceable', './focus', './compile-spy', './view-spy', 'aurelia-templating', './dynamic-element', './css-resource'], function (_export) {
  'use strict';

  var Compose, If, With, Repeat, Show, GlobalBehavior, SanitizeHtmlValueConverter, Replaceable, Focus, CompileSpy, ViewSpy, ViewEngine, _createDynamicElement, _createCSSResource;

  function configure(config) {
    config.globalResources('./compose', './if', './with', './repeat', './show', './replaceable', './global-behavior', './sanitize-html', './focus', './compile-spy', './view-spy');

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

          return (_ref = {}, _ref[elementName] = _createDynamicElement(elementName, address, bindable), _ref);
        });
      }
    });

    viewEngine.addResourcePlugin('.css', {
      'fetch': function fetch(address) {
        var _ref2;

        return (_ref2 = {}, _ref2[address] = _createCSSResource(address), _ref2);
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
    }, function (_aureliaTemplating) {
      ViewEngine = _aureliaTemplating.ViewEngine;
    }, function (_dynamicElement) {
      _createDynamicElement = _dynamicElement._createDynamicElement;
    }, function (_cssResource) {
      _createCSSResource = _cssResource._createCSSResource;
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