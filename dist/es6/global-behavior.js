import {Behavior} from 'aurelia-templating';

export class GlobalBehavior {
  static metadata(){ 
    return Behavior
      .attachedBehavior('global-behavior')
      .withOptions().and(x => x.dynamic()); 
  }

  static inject() { return [Element]; }
  constructor(element) {
    this.element = element;
  }

  bind(){
    var handler = GlobalBehavior.handlers[this.aureliaAttrName];

    if(!handler){
      throw new Error(`Conventional binding handler not found for ${this.aureliaAttrName}.`);
    }

    try{
      this.instance = handler.bind(this, this.element, this.aureliaCommand);
      this.handler = handler;
    }catch(error){
      throw new Error('Conventional binding handler failed.', error);
    }
  }

  attached(){
    if(this.handler && 'attached' in this.handler && this.instance){
      this.handler.attached(this.instance);
    }
  }

  detached(){
    if(this.handler && 'detached' in this.handler && this.instance){
      this.handler.detached(this.instance);
    }
  }

  unbind(){
    if(this.handler && 'unbind' in this.handler && this.instance){
      this.handler.unbind(this.instance);
      this.instance = null;
      this.handler = null;
    }
  }
}

GlobalBehavior.createSettingsFromBehavior = function(behavior){
  var settings = {};

  for(var key in behavior){
    if(key === 'aureliaAttrName' || key === 'aureliaCommand' || !behavior.hasOwnProperty(key)){
      continue;
    }

    settings[key] = behavior[key];
  }

  return settings;
};

GlobalBehavior.jQueryPlugins = {};

GlobalBehavior.handlers = { 
  jquery:{
    bind(behavior, element, command){
      var settings = GlobalBehavior.createSettingsFromBehavior(behavior);
      var pluginName = GlobalBehavior.jQueryPlugins[command] || command;
      return window.jQuery(element)[pluginName](settings);
    },
    unbind(instance){
      if('destroy' in instance){
        instance.destroy();
      }
    }
  }
};