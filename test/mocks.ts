// tslint:disable:no-empty
import { Repeat } from '../src/repeat';

export class ViewSlotMock {
  children: any[];
  constructor() {
    this.children = [];
  }
  removeAll() {
    this.children.splice(0, this.children.length);
  }
  add(view) {
    this.children.push(view);
  }
  insert(index, view) {
    if (index < 0) {
      throw 'negative index';
    }
    this.children.splice(index, 0, view);
  }
  removeAt(index) {
    if (index < 0) {
      throw 'negative index';
    }
    this.children.splice(index, 1);
  }
}

export class ViewMock {
  bindingContext: any;
  overrideContext: any;
  bind(bindingContext, overrideContext) {
    this.bindingContext = bindingContext;
    this.overrideContext = overrideContext;
  }
  attached() {}
  detached() {}
  unbind() {}
  returnToCache() {}
}

export class BoundViewFactoryMock {
  _viewsRequireLifecycle = true;
  create() {
    return { bind() {} };
  }
  removeAll() {}
}

export class ViewFactoryMock {
  _viewsRequireLifecycle = true;
  create() {
    return new ViewMock();
  }
}

export class ArrayObserverMock {
  subscribe() {}
  unsubscribe() {}
}

export class RepeatStrategyMock {
  instanceChanged(repeat: Repeat, items: any) { }
  instanceMutated(repeat: Repeat, items: any, changes: any) { }
  getCollectionObserver(observerLocator: any, items: any) { return null; }
}

export const instructionMock = {
  behaviorInstructions: [
    {
      originalAttrName: 'repeat.for',
      attributes: {
        items: {
          sourceExpression: {
            evaluate: (scope, lookupFunctions) => null
          }
        }
      }
    }
  ]
};

export const viewResourcesMock = {
  lookupFunctions: {
    valueConverters: name => null,
    bindingBehaviors: name => null
  }
};
