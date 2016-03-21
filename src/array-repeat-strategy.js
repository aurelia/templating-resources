import {createFullOverrideContext, updateOverrideContexts} from './repeat-utilities';
import {mergeSplice} from 'aurelia-binding';

/**
* A strategy for repeating a template over an array.
*/
export class ArrayRepeatStrategy {
  /**
  * Gets an observer for the specified collection.
  * @param observerLocator The observer locator instance.
  * @param items The items to be observed.
  */
  getCollectionObserver(observerLocator, items) {
    return observerLocator.getArrayObserver(items);
  }

  /**
  * Handle the repeat's collection instance changing.
  * @param repeat The repeater instance.
  * @param items The new array instance.
  */
  instanceChanged(repeat, items) {
    if (repeat.viewsRequireLifecycle) {
      let removePromise = repeat.removeAllViews(true);
      if (removePromise instanceof Promise) {
        removePromise.then(() => this._standardProcessInstanceChanged(repeat, items));
        return;
      }
      this._standardProcessInstanceChanged(repeat, items);
      return;
    }
    this._inPlaceProcessItems(repeat, items);
  }

  _standardProcessInstanceChanged(repeat, items) {
    for (let i = 0, ii = items.length; i < ii; i++) {
      let overrideContext = createFullOverrideContext(repeat, items[i], i, ii);
      repeat.addView(overrideContext.bindingContext, overrideContext);
    }
  }

  _inPlaceProcessItems(repeat, items) {
    let itemsLength = items.length;
    let viewsLength = repeat.viewCount();
    // remove unneeded views.
    while (viewsLength > itemsLength) {
      viewsLength--;
      repeat.removeView(viewsLength, true);
    }
    // avoid repeated evaluating the property-getter for the "local" property.
    let local = repeat.local;
    // re-evaluate bindings on existing views.
    for (let i = 0; i < viewsLength; i++) {
      let view = repeat.view(i);
      let last = i === itemsLength - 1;
      let middle = i !== 0 && !last;
      // any changes to the binding context?
      if (view.bindingContext[local] === items[i]
        && view.overrideContext.$middle === middle
        && view.overrideContext.$last === last) {
        // no changes. continue...
        continue;
      }
      // update the binding context and refresh the bindings.
      view.bindingContext[local] = items[i];
      view.overrideContext.$middle = middle;
      view.overrideContext.$last = last;
      repeat.updateBindings(view);
    }
    // add new views
    for (let i = viewsLength; i < itemsLength; i++) {
      let overrideContext = createFullOverrideContext(repeat, items[i], i, itemsLength);
      repeat.addView(overrideContext.bindingContext, overrideContext);
    }
  }

  /**
  * Handle the repeat's collection instance mutating.
  * @param repeat The repeat instance.
  * @param array The modified array.
  * @param splices Records of array changes.
  */
  instanceMutated(repeat, array, splices) {
    if (repeat.viewsRequireLifecycle) {
      this._standardProcessInstanceMutated(repeat, array, splices);
      return;
    }
    this._inPlaceProcessItems(repeat, array);
  }

  _standardProcessInstanceMutated(repeat, array, splices) {
    if (repeat.__queuedSplices) {
      for (let i = 0, ii = splices.length; i < ii; ++i) {
        let {index, removed, addedCount} = splices[i];
        mergeSplice(repeat.__queuedSplices, index, removed, addedCount);
      }
      // Array.prototype.slice is used here to clone the array
      repeat.__array = array.slice(0);
      return;
    }

    // Array.prototype.slice is used here to clone the array
    let maybePromise = this._runSplices(repeat, array.slice(0), splices);
    if (maybePromise instanceof Promise) {
      let queuedSplices = repeat.__queuedSplices = [];

      let runQueuedSplices = () => {
        if (!queuedSplices.length) {
          repeat.__queuedSplices = undefined;
          repeat.__array = undefined;
          return;
        }

        let nextPromise = this._runSplices(repeat, repeat.__array, queuedSplices) || Promise.resolve();
        queuedSplices = repeat.__queuedSplices = [];
        nextPromise.then(runQueuedSplices);
      };

      maybePromise.then(runQueuedSplices);
    }
  }

  /**
  * Run a normalised set of splices against the viewSlot children.
  * @param repeat The repeat instance.
  * @param array The modified array.
  * @param splices Records of array changes.
  * @return {Promise|undefined} A promise if animations have to be run.
  * @pre The splices must be normalised so as:
  *  * Any item added may not be later removed.
  *  * Removals are ordered by asending index
  */
  _runSplices(repeat, array, splices) {
    let removeDelta = 0;
    let rmPromises = [];

    for (let i = 0, ii = splices.length; i < ii; ++i) {
      let splice = splices[i];
      let removed = splice.removed;

      for (let j = 0, jj = removed.length; j < jj; ++j) {
        // the rmPromises.length correction works due to the ordered removal precondition
        let viewOrPromise = repeat.removeView(splice.index + removeDelta + rmPromises.length, true);
        if (viewOrPromise instanceof Promise) {
          rmPromises.push(viewOrPromise);
        }
      }
      removeDelta -= splice.addedCount;
    }

    if (rmPromises.length > 0) {
      return Promise.all(rmPromises).then(() => {
        let spliceIndexLow = this._handleAddedSplices(repeat, array, splices);
        updateOverrideContexts(repeat.views(), spliceIndexLow);
      });
    }

    let spliceIndexLow = this._handleAddedSplices(repeat, array, splices);
    updateOverrideContexts(repeat.views(), spliceIndexLow);
  }

  _handleAddedSplices(repeat, array, splices) {
    let spliceIndex;
    let spliceIndexLow;
    let arrayLength = array.length;
    for (let i = 0, ii = splices.length; i < ii; ++i) {
      let splice = splices[i];
      let addIndex = spliceIndex = splice.index;
      let end = splice.index + splice.addedCount;

      if (typeof spliceIndexLow === 'undefined' || spliceIndexLow === null || spliceIndexLow > splice.index) {
        spliceIndexLow = spliceIndex;
      }

      for (; addIndex < end; ++addIndex) {
        let overrideContext = createFullOverrideContext(repeat, array[addIndex], addIndex, arrayLength);
        repeat.insertView(addIndex, overrideContext.bindingContext, overrideContext);
      }
    }

    return spliceIndexLow;
  }
}
