import {Compose} from './compose';
import {If} from './if';
import {With} from './with';
import {Repeat} from './repeat';
import {Show} from './show';
import {GlobalBehavior} from './global-behavior';
import {SanitizeHtmlValueConverter} from './sanitize-html';
import {Replaceable} from './replaceable';
import {Focus} from './focus';
import {CompileSpy} from './compile-spy';
import {ViewSpy} from './view-spy';
import {ViewEngine} from 'aurelia-templating';
import {_createDynamicElement} from './dynamic-element';
import {_createCSSResource} from './css-resource';
import {FEATURE, DOM} from 'aurelia-pal';

function configure(config) {
  if (FEATURE.shadowDOM) {
    DOM.injectStyles('body /deep/ .aurelia-hide { display:none !important; }');
  } else {
    DOM.injectStyles('.aurelia-hide { display:none !important; }');
  }

  config.globalResources(
    './compose',
    './if',
    './with',
    './repeat',
    './show',
    './replaceable',
    './global-behavior',
    './sanitize-html',
    './focus',
    './compile-spy',
    './view-spy'
  );

  let viewEngine = config.container.get(ViewEngine);
  let loader = config.aurelia.loader;

  viewEngine.addResourcePlugin('.html', {
    'fetch': function(address) {
      return loader.loadTemplate(address).then(registryEntry => {
        let bindable = registryEntry.template.getAttribute('bindable');
        let elementName = address.replace('.html', '');
        let index = elementName.lastIndexOf('/');

        if (index !== 0) {
          elementName = elementName.substring(index + 1);
        }

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

  viewEngine.addResourcePlugin('.css', {
    'fetch': function(address) {
      return { [address]: _createCSSResource(address) };
    }
  });
}

export {
  Compose,
  If,
  With,
  Repeat,
  Show,
  SanitizeHtmlValueConverter,
  GlobalBehavior,
  Replaceable,
  Focus,
  CompileSpy,
  ViewSpy,
  configure
};
