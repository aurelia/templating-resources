/*eslint new-cap:0, padded-blocks:0*/
import {ViewResources, injectStyles, resource, ViewCompileInstruction} from 'aurelia-templating';
import {Loader} from 'aurelia-loader';
import {Container} from 'aurelia-dependency-injection';

class CSSResource {
  constructor(address: string) {
    this.address = address;
    this._global = null;
    this._scoped = null;
  }

  analyze(container: Container, target: Function): void {
    this._global = new target('global');
    this._scoped = new target('scoped');
  }

  register(registry: ViewResources, name?: string): void {
    registry.registerViewEngineHooks(name === 'scoped' ? this._scoped : this._global);
  }

  load(container: Container): Promise<CSSResource> {
    return container.get(Loader).loadText(this.address).then(text => {
      this._global.css = text;
      this._scoped.css = text;
      return this;
    });
  }
}

class CSSViewEngineHooks {
  constructor(mode: string) {
    this.mode = mode;
    this.css = null;
    this._alreadyGloballyInjected = false;
  }

  beforeCompile(content: DocumentFragment, resources: ViewResources, instruction: ViewCompileInstruction): void {
    if (this.mode === 'scoped') {
      let styleNode = injectStyles(this.css, content, true);
      if (!instruction.targetShadowDOM) {
        styleNode.setAttribute('scoped', 'scoped');
      }
    } else if (!this._alreadyGloballyInjected) {
      injectStyles(this.css);
      this._alreadyGloballyInjected = true;
    }
  }
}

export function _createCSSResource(address: string): Function {
  @resource(new CSSResource(address))
  class ViewCSS extends CSSViewEngineHooks {}
  return ViewCSS;
}
