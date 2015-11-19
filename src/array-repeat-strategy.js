import {createFullOverrideContext, updateOverrideContexts} from './repeat-utilities';

/**
* A strategy for repeating a template over an array.
*/
export class ArrayRepeatStrategy {
  /**
  * Process the provided array items.
  * @param items The underlying array.
  */
  instanceChanged(repeat, items) {
    let i;
    let ii;
    let overrideContext;
    let view;
    for (i = 0, ii = items.length; i < ii; ++i) {
      overrideContext = createFullOverrideContext(repeat, items[i], i, ii);
      view = repeat.viewFactory.create();
      view.bind(overrideContext.bindingContext, overrideContext);
      repeat.viewSlot.add(view);
    }
  }

  /**
  * Gets an Array observer.
  * @param items The items to be observed.
  */
  getCollectionObserver(observerLocator, items) {
    return observerLocator.getArrayObserver(items);
  }

  /**
  * Handles changes to the underlying array.
  * @param array The modified array.
  * @param splices Records of array changes.
  */
  instanceMutated(repeat, array, splices) {
    let removeDelta = 0;
    let viewSlot = repeat.viewSlot;
    let rmPromises = [];

    for (let i = 0, ii = splices.length; i < ii; ++i) {
      let splice = splices[i];
      let removed = splice.removed;

      for (let j = 0, jj = removed.length; j < jj; ++j) {
        let viewOrPromise = viewSlot.removeAt(splice.index + removeDelta + rmPromises.length, true);
        if (viewOrPromise instanceof Promise) {
          rmPromises.push(viewOrPromise);
        }
      }
      removeDelta -= splice.addedCount;
    }

    if (rmPromises.length > 0) {
      Promise.all(rmPromises).then(() => {
        let spliceIndexLow = this._handleAddedSplices(repeat, array, splices);
        updateOverrideContexts(repeat.viewSlot.children, spliceIndexLow);
      });
    } else {
      let spliceIndexLow = this._handleAddedSplices(repeat, array, splices);
      updateOverrideContexts(repeat.viewSlot.children, spliceIndexLow);
    }
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
        let view = repeat.viewFactory.create();
        view.bind(overrideContext.bindingContext, overrideContext);
        repeat.viewSlot.insert(addIndex, view);
      }
    }

    return spliceIndexLow;
  }
}
