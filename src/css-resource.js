/*eslint new-cap:0, padded-blocks:0*/
import {ViewResources, resource, ViewCompileInstruction} from 'aurelia-templating';
import {Loader} from 'aurelia-loader';
import {Container} from 'aurelia-dependency-injection';
import {relativeToFile} from 'aurelia-path';
import {DOM, FEATURE} from 'aurelia-pal';

let cssUrlMatcher = /url\((?!['"]data)([^)]+)\)/gi;

function fixupCSSUrls(address, css) {
  if (typeof css !== 'string') {
    throw new Error(`Failed loading required CSS file: ${address}`);
  }
  return css.replace(cssUrlMatcher, (match, p1) => {
    let quote = p1.charAt(0);
    if (quote === '\'' || quote === '"') {
      p1 = p1.substr(1, p1.length - 2);
    }
    return 'url(\'' + relativeToFile(p1, address) + '\')';
  });
}

class CSSResource {
  constructor(address: string) {
    this.address = address;
    this._scoped = null;
    this._global = false;
    this._alreadyGloballyInjected = false;
  }

  initialize(container: Container, target: Function): void {
    this._scoped = new target(this);
  }

  register(registry: ViewResources, name?: string): void {
    if (name === 'scoped') {
      registry.registerViewEngineHooks(this._scoped);
    } else {
      this._global = true;
    }
  }

  load(container: Container): Promise<CSSResource> {
    return container.get(Loader)
      .loadText(this.address)
      .catch(err => null)
      .then(text => {
        text = fixupCSSUrls(this.address, text);
        this._scoped.css = text;
        if (this._global) {
          this._alreadyGloballyInjected = true;
          DOM.injectStyles(text);
        }
      });
  }
}

class CSSViewEngineHooks {
  constructor(owner: CSSResource) {
    this.owner = owner;
    this.css = null;
  }

  beforeCompile(content: DocumentFragment, resources: ViewResources, instruction: ViewCompileInstruction): void {
    if (instruction.targetShadowDOM) {
      DOM.injectStyles(this.css, content, true);
    } else if (FEATURE.scopedCSS) {
      let styleNode = DOM.injectStyles(this.css, content, true);
      styleNode.setAttribute('scoped', 'scoped');
    } else if (this._global && !this.owner._alreadyGloballyInjected) {
      DOM.injectStyles(this.css);
      this.owner._alreadyGloballyInjected = true;
    }
  }
}

export function _createCSSResource(address: string): Function {
  @resource(new CSSResource(address))
  class ViewCSS extends CSSViewEngineHooks {}
  return ViewCSS;
}
