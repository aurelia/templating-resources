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
  constructor(address: string, removeInjectedStyles: boolean) {
    this.address = address;
    this.removeInjectedStyles = removeInjectedStyles;
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
      if (this.removeInjectedStyles === true) {
        registry.registerViewEngineHooks(this._scoped);
      }
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
          if (this.removeInjectedStyles === true) {
            this._scoped.styleNode = DOM.injectStyles(text);
          } else {
            DOM.injectStyles(text);
          }
        }
      });
  }
}

class CSSViewEngineHooks {
  constructor(owner: CSSResource) {
    this.owner = owner;
    this.css = null;
    if (owner.removeInjectedStyles === true) {
      this.beforeUnbind = () => {
        if (this.owner._global && this.owner._alreadyGloballyInjected) {
          DOM.removeNode(this.styleNode);
          this.owner._alreadyGloballyInjected = false;
        }
      }
      this.beforeBind = () => {
        if (this.owner._global && !this.owner._alreadyGloballyInjected && this.owner.removeInjectedStyles === true) {
          this.styleNode = DOM.injectStyles(this.css);
          this.owner._alreadyGloballyInjected = true;
        }
      }
    }
  }

  beforeCompile(content: DocumentFragment, resources: ViewResources, instruction: ViewCompileInstruction): void {
    if (instruction.targetShadowDOM) {
      DOM.injectStyles(this.css, content, true);
    } else if (FEATURE.scopedCSS) {
      let styleNode = DOM.injectStyles(this.css, content, true);
      styleNode.setAttribute('scoped', 'scoped');
    } else if (this.owner._global && !this.owner._alreadyGloballyInjected) {
      if (this.owner.removeInjectedStyles === true) {
        this.styleNode = DOM.injectStyles(this.css);
      } else {
        DOM.injectStyles(this.css);
      }
      this.owner._alreadyGloballyInjected = true;
    }
  }
}

export function _createCSSResource(address: string, removeInjectedStyles: boolean): Function {
  @resource(new CSSResource(address, removeInjectedStyles))
  class ViewCSS extends CSSViewEngineHooks {}
  return ViewCSS;
}
