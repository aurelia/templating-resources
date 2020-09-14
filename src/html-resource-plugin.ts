import {ViewEngine} from 'aurelia-templating';
import {_createDynamicElement} from './dynamic-element';

const VIEW_EXTENSIONS = ['html', 'jade', 'pug'];
const VIEW_REGEXP = new RegExp('([^\\/^\\?]+)\\.(' + VIEW_EXTENSIONS.join('|') + ')', 'i');

export function getElementName(address) {
  return VIEW_REGEXP.exec(address)[1].toLowerCase();
}

export function configure(config) {
  const viewEngine = config.container.get(ViewEngine);
  const loader = config.aurelia.loader;

  const fetch = function(viewUrl) {
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
  };

  for (const ext of VIEW_EXTENSIONS) {
    viewEngine.addResourcePlugin('.' + ext, {fetch});
  }
}
