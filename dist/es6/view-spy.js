import {customAttribute} from 'aurelia-templating';
import {inject} from 'aurelia-dependency-injection';
import * as LogManager from 'aurelia-logging';

@customAttribute('view-spy')
export class ViewSpy {
  constructor(){
    this.logger = LogManager.getLogger('view-spy');
  }

  log(lifecycleName, context){
    if(!this.value || this.value.indexOf(lifecycleName) !== -1){
      this.logger.info(lifecycleName, this.view, context);
    }
  }

  created(view){
    this.view = view;
    this.log('created');
  }

  bind(bindingContext){
    this.log('bind', bindingContext);
  }

  attached(){
    this.log('attached');
  }

  detached(){
    this.log('detached');
  }

  unbind(){
    this.log('unbind');
  }
}
