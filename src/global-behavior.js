import {AttachedBehavior, OptionsProperty} from 'aurelia-templating';

export class GlobalBehavior {
  static annotations(){
    return [
      new AttachedBehavior('global-behavior'),
      new OptionsProperty().dynamic()
    ];
  }

  static inject() { return [Element]; }
  constructor(element) {
    this.element = element;
  }

  getGlobal(name){
    name = GlobalBehavior.lookup[name] || name;
    return window[name];
  }

  bind(){
    var settings = {};

    for(var key in this){
      if(key === 'aureliaAttrName' || key === 'aureliaCommand' || !this.hasOwnProperty(key)){
        continue;
      }

      settings[key] = this[key];
    }

    var globalObject = this.getGlobal(this.aureliaAttrName);

    try{
      globalObject(this.element)[this.aureliaCommand](settings);
    }catch(error){
      throw new Error('Conventional global binding behavior failed.', error);
    }
  }
}

GlobalBehavior.lookup = { jquery:'jQuery' };