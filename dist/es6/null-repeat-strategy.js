/**
* A strategy for repeating a template over null or undefined (does nothing)
*/
export class NullRepeatStrategy {
  instanceChanged(repeat, items) {
    repeat.viewSlot.removeAll(true);
  }

  getCollectionObserver(observerLocator, items) {
  }
}
