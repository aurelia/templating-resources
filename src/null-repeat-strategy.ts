/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * A strategy for repeating a template over null or undefined (does nothing)
 */
export class NullRepeatStrategy {
  instanceChanged(repeat, items): void {
    repeat.removeAllViews(true);
  }

  getCollectionObserver(observerLocator, items): any {
    // empty
  }
}
