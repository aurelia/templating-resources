/*eslint new-cap:0, padded-blocks:0*/
import {ViewResources, resource, ViewCompileInstruction} from 'aurelia-templating';
import {Loader} from 'aurelia-loader';
import {Container} from 'aurelia-dependency-injection';
import {relativeToFile} from 'aurelia-path';
import {DOM, FEATURE} from 'aurelia-pal';

let cssUrlMatcher = /url\((?!['"]data)([^)]+)\)/gi;

function fixupCSSUrls(address: string, css: string) {
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
  /**
   *@internal
   */
  address: string;
  /**
   *@internal
   */
  _scoped: any;
  /**
   *@internal
   */
  _global: boolean;
  /**
   *@internal
   */
  _alreadyGloballyInjected: boolean;

  constructor(address: string) {
    this.address = address;
    this._scoped = null;
    this._global = false;
    this._alreadyGloballyInjected = false;
  }

  initialize(container: Container, Target: Function): void {
    this._scoped = new (Target as any)(this);
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
      .catch(() => null)
      .then(text => {
        text = fixupCSSUrls(this.address, text);
        this._scoped.css = text;
        if (this._global) {
          this._alreadyGloballyInjected = true;
          DOM.injectStyles(text);
        }
        return this;
      });
  }
}

class CSSViewEngineHooks {
  owner: CSSResource;
  css: any;
  _global: boolean;
  constructor(owner: CSSResource) {
    this.owner = owner;
    this.css = null;
  }

  beforeCompile(content: DocumentFragment, resources: ViewResources, instruction: ViewCompileInstruction): void {
    if (instruction.targetShadowDOM) {
      DOM.injectStyles(this.css, content as any, true);
    } else if (FEATURE.scopedCSS) {
      let styleNode = DOM.injectStyles(this.css, content as any, true) as Element;
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
