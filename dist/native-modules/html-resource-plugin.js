import { ViewEngine } from 'aurelia-templating';
import { _createDynamicElement } from './dynamic-element';

export function getElementName(address) {
  return (/([^\/^\?]+)\.html/i.exec(address)[1].toLowerCase()
  );
}

export function configure(config) {
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