'use strict';

System.register(['aurelia-templating', './dynamic-element'], function (_export, _context) {
  "use strict";

  var ViewEngine, _createDynamicElement;

  function getElementName(address) {
    return (/([^\/^\?]+)\.html/i.exec(address)[1].toLowerCase()
    );
  }

  _export('getElementName', getElementName);

  function configure(config) {
    var viewEngine = config.container.get(ViewEngine);
    var loader = config.aurelia.loader;

    viewEngine.addResourcePlugin('.html', {
      'fetch': function fetch(viewUrl) {
        return loader.loadTemplate(viewUrl).then(function (registryEntry) {
          var _ref;

          var bindableNames = registryEntry.template.getAttribute('bindable');
          var useShadowDOMmode = registryEntry.template.getAttribute('use-shadow-dom');
          var name = getElementName(viewUrl);

          if (bindableNames) {
            bindableNames = bindableNames.split(',').map(function (x) {
              return x.trim();
            });
            registryEntry.template.removeAttribute('bindable');
          } else {
            bindableNames = [];
          }

          return _ref = {}, _ref[name] = _createDynamicElement({ name: name, viewUrl: viewUrl, bindableNames: bindableNames, useShadowDOMmode: useShadowDOMmode }), _ref;
        });
      }
    });
  }

  _export('configure', configure);

  return {
    setters: [function (_aureliaTemplating) {
      ViewEngine = _aureliaTemplating.ViewEngine;
    }, function (_dynamicElement) {
      _createDynamicElement = _dynamicElement._createDynamicElement;
    }],
    execute: function () {}
  };
});