import {ViewEngine} from 'aurelia-templating';
import {_createDynamicElement} from './dynamic-element';

export function getElementName(address) {
  let elementName = address.replace('.html', '');
  let index = elementName.lastIndexOf('/');

  if (index !== 0) {
    elementName = elementName.substring(index + 1);
  }
  return elementName;
}

export function configure(config) {
  let viewEngine = config.container.get(ViewEngine);
  let loader = config.aurelia.loader;

  viewEngine.addResourcePlugin('.html', {
    'fetch': function(address) {
      return loader.loadTemplate(address).then(registryEntry => {
        let bindable = registryEntry.template.getAttribute('bindable');
        let elementName = getElementName(address);

        if (bindable) {
          bindable = bindable.split(',').map(x => x.trim());
          registryEntry.template.removeAttribute('bindable');
        } else {
          bindable = [];
        }

        return { [elementName]: _createDynamicElement(elementName, address, bindable) };
      });
    }
  });
}
