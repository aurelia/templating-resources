import { createFullOverrideContext, updateOverrideContexts } from './repeat-utilities';

export let SetRepeatStrategy = class SetRepeatStrategy {
  getCollectionObserver(observerLocator, items) {
    return observerLocator.getSetObserver(items);
  }

  instanceChanged(repeat, items) {
    let removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
    if (removePromise instanceof Promise) {
      removePromise.then(() => this._standardProcessItems(repeat, items));
      return;
    }
    this._standardProcessItems(repeat, items);
  }

  _standardProcessItems(repeat, items) {
    let index = 0;
    let overrideContext;

    items.forEach(value => {
      overrideContext = createFullOverrideContext(repeat, value, index, items.size);
      repeat.addView(overrideContext.bindingContext, overrideContext);
      ++index;
    });
  }

  instanceMutated(repeat, set, records) {
    let value;
    let i;
    let ii;
    let overrideContext;
    let removeIndex;
    let record;
    let rmPromises = [];
    let viewOrPromise;

    for (i = 0, ii = records.length; i < ii; ++i) {
      record = records[i];
      value = record.value;
      switch (record.type) {
        case 'add':
          let size = Math.max(set.size - 1, 0);
          overrideContext = createFullOverrideContext(repeat, value, size, set.size);
          repeat.insertView(size, overrideContext.bindingContext, overrideContext);
          break;
        case 'delete':
          removeIndex = this._getViewIndexByValue(repeat, value);
          viewOrPromise = repeat.removeView(removeIndex, true, !repeat.viewsRequireLifecycle);
          if (viewOrPromise instanceof Promise) {
            rmPromises.push(viewOrPromise);
          }
          break;
        case 'clear':
          repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
          break;
        default:
          continue;
      }
    }

    if (rmPromises.length > 0) {
      Promise.all(rmPromises).then(() => {
        updateOverrideContexts(repeat.views(), 0);
      });
    } else {
      updateOverrideContexts(repeat.views(), 0);
    }
  }

  _getViewIndexByValue(repeat, value) {
    let i;
    let ii;
    let child;

    for (i = 0, ii = repeat.viewCount(); i < ii; ++i) {
      child = repeat.view(i);
      if (child.bindingContext[repeat.local] === value) {
        return i;
      }
    }

    return undefined;
  }
};