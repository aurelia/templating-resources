import {AttachedBehavior, OptionsProperty} from 'aurelia-templating';

export class GlobalBehavior {
  static metadata(){
    return [
      new AttachedBehavior('global-behavior'),
      new OptionsProperty().dynamic()
    ];
  }

  static inject() { return [Element]; }
  constructor(element) {
    this.element = element;
  }

  bind(){
    var settings, lookup, globalObject;

    lookup = GlobalBehavior.whitelist[this.aureliaAttrName];
    if(!lookup){
      throw new Error(`Conventional global binding behavior not whitelisted for ${this.aureliaAttrName}.`);
    }

    globalObject = window[lookup];
    if(!globalObject){
      throw new Error(`Conventional global ${lookup} was not found.`);
    }

    settings = {};

    for(var key in this){
      if(key === 'aureliaAttrName' || key === 'aureliaCommand' || !this.hasOwnProperty(key)){
        continue;
      }

      settings[key] = this[key];
    }

    try{
      this.instance = globalObject(this.element)[this.aureliaCommand](settings);
    }catch(error){
      throw new Error('Conventional global binding behavior failed.', error);
    }
  }

  unbind(){
    if(this.instance && 'destroy' in this.instance){
      this.instance.destroy();
      this.instance = null;
    }
  }
}

GlobalBehavior.whitelist = { jquery:'jQuery' };