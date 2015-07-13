import {inject} from 'aurelia-dependency-injection';
import {customAttribute} from 'aurelia-templating';

function addStyleString(str) {
  var node = document.createElement('style');
  node.innerHTML = str;
  node.type = 'text/css';
  document.head.appendChild(node);
}

if(!!HTMLElement.prototype.createShadowRoot){
  addStyleString('body /deep/ .aurelia-hide { display:none !important; }');
}else{
  addStyleString('.aurelia-hide { display:none !important; }');
}

/**
* Binding to conditionally show markup in the DOM based on the value.
* - different from if in that the markup is still added to the DOM, simply not shown
*
* @class Show
* @constructor
* @param {Element} element The element that the to bind to
*/
@customAttribute('show')
@inject(Element)
export class Show {
  constructor(element) {
    this.element = element;
  }

  valueChanged(newValue){
    if (newValue) {
      this.element.classList.remove('aurelia-hide');
    } else {
      this.element.classList.add('aurelia-hide');
    }
  }

  bind(executionContext) {
    this.valueChanged(this.value);
  }
}
