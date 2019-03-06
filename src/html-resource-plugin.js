import {ViewEngine} from 'aurelia-templating';
import {_createDynamicElement} from './dynamic-element';

export function getElementName(address) {
  return /([^\/^\?]+)\.html/i.exec(address)[1].toLowerCase();
}

export function configure(config) {
  const viewEngine = config.container.get(ViewEngine);
  const loader = config.aurelia.loader;

  viewEngine.addResourcePlugin('.html', {
    'fetch': function(address) {
      return loader.loadTemplate(address).then(registryEntry => {
        let bindable = registryEntry.template.getAttribute('bindable');
        const useShadowDOM = registryEntry.template.getAttribute('use-shadow-dom') !== null;
        const elementName = getElementName(address);

        if (bindable) {
          bindable = bindable.split(',').map(x => x.trim());
          registryEntry.template.removeAttribute('bindable');
        } else {
          bindable = [];
        }

        return { [elementName]: _createDynamicElement(elementName, address, bindable, useShadowDOM) };
      });
    }
  });
}
