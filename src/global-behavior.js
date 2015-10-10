import {inject} from 'aurelia-dependency-injection';
import {customAttribute, dynamicOptions} from 'aurelia-templating';
import * as LogManager from 'aurelia-logging';
import {PLATFORM, DOM, AggregateError} from 'aurelia-pal';

@customAttribute('global-behavior')
@dynamicOptions
@inject(DOM.Element)
export class GlobalBehavior {
  constructor(element) {
    this.element = element;
    LogManager.getLogger('templating-resources').warn('The "GlobalBehavior" behavior will be removed in the next release.');
  }

  bind() {
    let handler = GlobalBehavior.handlers[this.aureliaAttrName];

    if (!handler) {
      throw new Error(`Binding handler not found for '${this.aureliaAttrName}.${this.aureliaCommand}'. Element:\n${this.element.outerHTML}\n`);
    }

    try {
      this.handler = handler.bind(this, this.element, this.aureliaCommand) || handler;
    } catch(error) {
      throw new AggregateError('Conventional binding handler failed.', error);
    }
  }

  attached() {
    if (this.handler && 'attached' in this.handler) {
      this.handler.attached(this, this.element);
    }
  }

  detached() {
    if (this.handler && 'detached' in this.handler) {
      this.handler.detached(this, this.element);
    }
  }

  unbind() {
    if (this.handler && 'unbind' in this.handler) {
      this.handler.unbind(this, this.element);
    }

    this.handler = null;
  }
}

GlobalBehavior.createSettingsFromBehavior = function(behavior) {
  let settings = {};

  for (let key in behavior) {
    if (key === 'aureliaAttrName' || key === 'aureliaCommand' || !behavior.hasOwnProperty(key)) {
      continue;
    }

    settings[key] = behavior[key];
  }

  return settings;
};

GlobalBehavior.jQueryPlugins = {};

GlobalBehavior.handlers = {
  jquery: {
    bind(behavior, element, command) {
      let settings = GlobalBehavior.createSettingsFromBehavior(behavior);
      let pluginName = GlobalBehavior.jQueryPlugins[command] || command;
      let jqueryElement = PLATFORM.global.jQuery(element);

      if (!jqueryElement[pluginName]) {
        LogManager.getLogger('templating-resources')
          .warn(`Could not find the jQuery plugin ${pluginName}, possibly due to case mismatch. Trying to enumerate jQuery methods in lowercase. Add the correctly cased plugin name to the GlobalBehavior to avoid this performance hit.`);

        for (let prop in jqueryElement) {
          if (prop.toLowerCase() === pluginName) {
            pluginName = prop;
          }
        }
      }

      behavior.plugin = jqueryElement[pluginName](settings);
    },
    unbind(behavior, element) {
      if (typeof behavior.plugin.destroy === 'function') {
        behavior.plugin.destroy();
        behavior.plugin =  null;
      }
    }
  }
};
