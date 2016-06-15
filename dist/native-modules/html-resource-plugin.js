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
    'fetch': function fetch(address) {
      return loader.loadTemplate(address).then(function (registryEntry) {
        var _ref;

        var bindable = registryEntry.template.getAttribute('bindable');
        var elementName = getElementName(address);

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
}