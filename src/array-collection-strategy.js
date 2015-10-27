import {CollectionStrategy} from './collection-strategy';

export class ArrayCollectionStrategy extends CollectionStrategy {
  processItems(items) {
    let i;
    let ii;
    let row;
    let view;
    let observer;
    this.items = items;
    for (i = 0, ii = items.length; i < ii; ++i) {
      row = super.createFullBindingContext(items[i], i, ii);
      view = this.viewFactory.create(row);
      this.viewSlot.add(view);
    }
  }

  getCollectionObserver(items){
    return this.observerLocator.getArrayObserver(items);
  }

  handleChanges(array, splices) {
    let removeDelta = 0;
    let viewSlot = this.viewSlot;
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
        let spliceIndexLow = this._handleAddedSplices(array, splices);
        this.updateBindingContexts(spliceIndexLow);
      });
    } else {
      let spliceIndexLow = this._handleAddedSplices(array, splices);
      super.updateBindingContexts(spliceIndexLow);
    }
  }

  _handleAddedSplices(array, splices) {
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
        let row = this.createFullBindingContext(array[addIndex], addIndex, arrayLength);
        let view = this.viewFactory.create(row);
        this.viewSlot.insert(addIndex, view);
      }
    }

    return spliceIndexLow;
  }
}
