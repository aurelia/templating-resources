import {ViewEngine} from 'aurelia-templating';
import {_createDynamicElement} from './dynamic-element';

export function getElementName(address) {
  return /([^\/^\?]+)\.html/i.exec(address)[1].toLowerCase();
}

export function configure(config) {
  const viewEngine = config.container.get(ViewEngine);
  const loader = config.aurelia.loader;

  viewEngine.addResourcePlugin('.html', {
    'fetch': function(viewUrl) {
      return loader.loadTemplate(viewUrl).then(registryEntry => {
        let bindableNames = registryEntry.template.getAttribute('bindable');
        const useShadowDOMmode: null | '' | 'open' | 'closed' = registryEntry.template.getAttribute('use-shadow-dom');
        const name = getElementName(viewUrl);

        if (bindableNames) {
          bindableNames = bindableNames.split(',').map(x => x.trim());
          registryEntry.template.removeAttribute('bindable');
        } else {
          bindableNames = [];
        }

        return { [name]: _createDynamicElement({name, viewUrl, bindableNames, useShadowDOMmode}) };
      });
    }
  });
}
