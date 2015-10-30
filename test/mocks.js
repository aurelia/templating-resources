export class ViewSlotMock {
  constructor() {
    this.children = [];
  }
  removeAll(){}
  add(view){
    this.children.push(view);
  }
  insert(index, view){
    this.children.splice(index, 0, view);
  }
  removeAt(index){
    if(index < 0) {
      throw "negative index";
    }
    this.children.splice(index, 1);
  }
}

export  class ViewMock {
  bind(bindingContext){
    this.bindingContext = bindingContext;
  }
  attached(){}
  detached(){}
  unbind(){}
  returnToCache(){}
}

export class BoundViewFactoryMock {
  create(){};
  removeAll(){};
}

export class ViewFactoryMock {
  create(){
    return new ViewMock();
  }
}

export class ArrayObserverMock {
  subscribe(){};
  unsubscribe(){};
}

export class CollectionStrategyMock {
  initialize() {}
  processItems() {}
  getCollectionObserver() {}
  dispose() {}
}
