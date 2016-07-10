import {createFullOverrideContext, updateOverrideContexts, updateOverrideContext, indexOf} from './repeat-utilities';
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
    const itemsLength = items.length;

    // if the new instance does not contain any items,
    // just remove all views and don't do any further processing
    if (!items || itemsLength === 0) {
      repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
      return;
    }

    const children = repeat.views();
    const viewsLength = children.length;

    // likewise, if we previously didn't have any views,
    // simply make them and return
    if (viewsLength === 0) {
      this._standardProcessInstanceChanged(repeat, items);
      return;
    }

    if (repeat.viewsRequireLifecycle) {
      const childrenSnapshot = children.slice(0);
      const itemNameInBindingContext = repeat.local;
      const matcher = repeat.matcher();

      // the cache of the current state (it will be transformed along with the views to keep track of indicies)
      let itemsPreviouslyInViews = [];
      const viewsToRemove = [];

      for (let index = 0; index < viewsLength; index++) {
        const view = childrenSnapshot[index];
        const oldItem = view.bindingContext[itemNameInBindingContext];

        if (indexOf(items, oldItem, matcher) === -1) {
          // remove the item if no longer in the new instance of items
          viewsToRemove.push(view);
        } else {
          // or add the item to the cache list
          itemsPreviouslyInViews.push(oldItem);
        }
      }

      let updateViews;
      let removePromise;

      if (itemsPreviouslyInViews.length > 0) {
        removePromise = repeat.removeViews(viewsToRemove, true, !repeat.viewsRequireLifecycle);
        updateViews = () => {
          // update views (create new and move existing)
          for (let index = 0; index < itemsLength; index++) {
            const item = items[index];
            const indexOfView = indexOf(itemsPreviouslyInViews, item, matcher, index);
            let view;

            if (indexOfView === -1) { // create views for new items
              const overrideContext = createFullOverrideContext(repeat, items[index], index, itemsLength);
              repeat.insertView(index, overrideContext.bindingContext, overrideContext);
              // reflect the change in our cache list so indicies are valid
              itemsPreviouslyInViews.splice(index, 0, undefined);
            } else if (indexOfView === index) { // leave unchanged items
              view = children[indexOfView];
              itemsPreviouslyInViews[indexOfView] = undefined;
            } else { // move the element to the right place
              view = children[indexOfView];
              repeat.moveView(indexOfView, index);
              itemsPreviouslyInViews.splice(indexOfView, 1);
              itemsPreviouslyInViews.splice(index, 0, undefined);
            }

            if (view) {
              updateOverrideContext(view.overrideContext, index, itemsLength);
            }
          }

          // remove extraneous elements in case of duplicates,
          // also update binding contexts if objects changed using the matcher function
          this._inPlaceProcessItems(repeat, items);
        };
      } else {
        // if all of the items are different, remove all and add all from scratch
        removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
        updateViews = () => this._standardProcessInstanceChanged(repeat, items);
      }

      if (removePromise instanceof Promise) {
        removePromise.then(updateViews);
      } else {
        updateViews();
      }
    } else {
      // no lifecycle needed, use the fast in-place processing
      this._inPlaceProcessItems(repeat, items);
    }
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
      repeat.removeView(viewsLength, true, !repeat.viewsRequireLifecycle);
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

    return undefined;
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
