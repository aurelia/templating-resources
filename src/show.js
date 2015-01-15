import {AttachedBehavior, Property} from 'aurelia-templating';

function addStyleString(str) {
  var node = document.createElement('style');
  node.innerHTML = str;
  document.body.appendChild(node);
}

addStyleString('.aurelia-hide { display:none; }');

export class Show {
  static annotations(){
    return [
      new AttachedBehavior('show'),
      new Property('value', 'valueChanged', 'show')
    ];
  }

  static inject() { return [Element]; }
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