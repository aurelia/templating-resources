import {createFullOverrideContext, updateOverrideContexts, updateOneTimeBinding} from './repeat-utilities';

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
      let removePromise = repeat.viewSlot.removeAll(true);
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
      let view = repeat.viewFactory.create();
      view.bind(overrideContext.bindingContext, overrideContext);
      repeat.viewSlot.add(view);
    }
  }

  _inPlaceProcessItems(repeat, items) {
    let itemsLength = items.length;
    let viewsLength = repeat.viewSlot.children.length;
    // remove unneeded views.
    while (viewsLength > itemsLength) {
      viewsLength--;
      repeat.viewSlot.removeAt(viewsLength, true);
    }
    // avoid repeated evaluating the property-getter for the "local" property.
    let local = repeat.local;
    // re-evaluate bindings on existing views.
    for (let i = 0; i < viewsLength; i++) {
      let view = repeat.viewSlot.children[i];
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
      let j = view.bindings.length;
      while (j--) {
        updateOneTimeBinding(view.bindings[j]);
      }
      j = view.controllers.length;
      while (j--) {
        let k = view.controllers[j].boundProperties.length;
        while (k--) {
          let binding = view.controllers[j].boundProperties[k].binding;
          updateOneTimeBinding(binding);
        }
      }
    }
    // add new views
    for (let i = viewsLength; i < itemsLength; i++) {
      let overrideContext = createFullOverrideContext(repeat, items[i], i, itemsLength);
      let view = repeat.viewFactory.create();
      view.bind(overrideContext.bindingContext, overrideContext);
      repeat.viewSlot.add(view);
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
