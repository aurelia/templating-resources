
export let NullRepeatStrategy = class NullRepeatStrategy {
  instanceChanged(repeat, items) {
    repeat.removeAllViews(true);
  }

  getCollectionObserver(observerLocator, items) {}
};