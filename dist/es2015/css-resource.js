
import { ViewResources, resource, ViewCompileInstruction } from 'aurelia-templating';
import { Loader } from 'aurelia-loader';
import { Container } from 'aurelia-dependency-injection';
import { relativeToFile } from 'aurelia-path';
import { DOM, FEATURE } from 'aurelia-pal';

let cssUrlMatcher = /url\((?!['"]data)([^)]+)\)/gi;

function fixupCSSUrls(address, css) {
  if (typeof css !== 'string') {
    throw new Error(`Failed loading required CSS file: ${ address }`);
  }
  return css.replace(cssUrlMatcher, (match, p1) => {
    let quote = p1.charAt(0);
    if (quote === '\'' || quote === '"') {
      p1 = p1.substr(1, p1.length - 2);
    }
    return 'url(\'' + relativeToFile(p1, address) + '\')';
  });
}

let CSSResource = class CSSResource {
  constructor(address) {
    this.address = address;
    this._global = null;
    this._scoped = null;
  }

  initialize(container, target) {
    this._global = new target('global');
    this._scoped = new target('scoped');
  }

  register(registry, name) {
    registry.registerViewEngineHooks(name === 'scoped' ? this._scoped : this._global);
  }

  load(container) {
    return container.get(Loader).loadText(this.address).catch(err => null).then(text => {
      text = fixupCSSUrls(this.address, text);
      this._global.css = text;
      this._scoped.css = text;
    });
  }
};
let CSSViewEngineHooks = class CSSViewEngineHooks {
  constructor(mode) {
    this.mode = mode;
    this.css = null;
    this._alreadyGloballyInjected = false;
  }

  beforeCompile(content, resources, instruction) {
    if (this.mode === 'scoped') {
      if (instruction.targetShadowDOM) {
        DOM.injectStyles(this.css, content, true);
      } else if (FEATURE.scopedCSS) {
        let styleNode = DOM.injectStyles(this.css, content, true);
        styleNode.setAttribute('scoped', 'scoped');
      } else if (!this._alreadyGloballyInjected) {
        DOM.injectStyles(this.css);
        this._alreadyGloballyInjected = true;
      }
    } else if (!this._alreadyGloballyInjected) {
      DOM.injectStyles(this.css);
      this._alreadyGloballyInjected = true;
    }
  }
};


export function _createCSSResource(address) {
  var _dec, _class;

  let ViewCSS = (_dec = resource(new CSSResource(address)), _dec(_class = class ViewCSS extends CSSViewEngineHooks {}) || _class);

  return ViewCSS;
}