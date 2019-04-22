import {createFullOverrideContext, updateOverrideContexts} from './repeat-utilities';

/**
* A strategy for repeating a template over a number.
*/
export class NumberRepeatStrategy {
  /**
  * Return the strategies collection observer. In this case none.
  */
  getCollectionObserver() {
    return null;
  }

  /**
  * Process the provided Number.
  * @param value The Number of how many time to iterate.
  */
  instanceChanged(repeat, value) {
    let removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
    if (removePromise instanceof Promise) {
      removePromise.then(() => this._standardProcessItems(repeat, value));
      return;
    }
    this._standardProcessItems(repeat, value);
  }

  _standardProcessItems(repeat, value) {
    let childrenLength = repeat.viewCount();
    let i;
    let ii;
    let overrideContext;
    let viewsToRemove;

    value = Math.floor(value);
    viewsToRemove = childrenLength - value;

    if (viewsToRemove > 0) {
      if (viewsToRemove > childrenLength) {
        viewsToRemove = childrenLength;
      }

      for (i = 0, ii = viewsToRemove; i < ii; ++i) {
        repeat.removeView(childrenLength - (i + 1), true, !repeat.viewsRequireLifecycle);
      }

      return;
    }

    for (i = childrenLength, ii = value; i < ii; ++i) {
      overrideContext = createFullOverrideContext(repeat, i, i, ii);
      repeat.addView(overrideContext.bindingContext, overrideContext);
    }

    updateOverrideContexts(repeat.views(), 0);
  }
}
