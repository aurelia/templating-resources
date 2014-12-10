import {AttachedBehavior, Property} from 'aurelia-templating';

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
    this.displayStyle = element.style.display;
  }

  valueChanged(newValue){
    if(newValue){
      this.element.style.display = this.displayStyle || 'block';
    }else{
      this.displayStyle = this.element.style.display;
      this.element.style.display = 'none';
    }
  }
}