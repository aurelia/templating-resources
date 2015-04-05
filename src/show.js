import {inject} from 'aurelia-dependency-injection';
import {customAttribute} from 'aurelia-templating';

function addStyleString(str) {
  var node = document.createElement('style');
  node.innerHTML = str;
  node.type = 'text/css';
  document.head.appendChild(node);
}

addStyleString('.aurelia-hide { display:none !important; }');

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
}
