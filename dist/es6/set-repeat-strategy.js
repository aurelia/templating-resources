import {createFullOverrideContext, updateOverrideContexts} from './repeat-utilities';

/**
* A strategy for repeating a template over a Set.
*/
export class SetRepeatStrategy {
  /**
  * Gets a Set observer.
  * @param items The items to be observed.
  */
  getCollectionObserver(observerLocator, items) {
    return observerLocator.getSetObserver(items);
  }

  /**
  * Process the provided Set entries.
  * @param items The entries to process.
  */
  instanceChanged(repeat, items) {
    let removePromise = repeat.viewSlot.removeAll(true);
    if (removePromise instanceof Promise) {
      removePromise.then(() => this._standardProcessItems(repeat, items));
      return;
    }
    this._standardProcessItems(repeat, items);
  }

  _standardProcessItems(repeat, items) {
    let viewFactory = repeat.viewFactory;
    let viewSlot = repeat.viewSlot;
    let index = 0;
    let overrideContext;
    let view;

    items.forEach(value => {
      overrideContext = createFullOverrideContext(repeat, value, index, items.size);
      view = viewFactory.create();
      view.bind(overrideContext.bindingContext, overrideContext);
      viewSlot.add(view);
      ++index;
    });
  }

  /**
  * Handle changes in a Set collection.
  * @param map The underlying Set collection.
  * @param records The change records.
  */
  instanceMutated(repeat, set, records) {
    let viewSlot = repeat.viewSlot;
    let value;
    let i;
    let ii;
    let view;
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
        overrideContext = createFullOverrideContext(repeat, value, set.size - 1, set.size);
        view = repeat.viewFactory.create();
        view.bind(overrideContext.bindingContext, overrideContext);
        viewSlot.insert(set.size - 1, view);
        break;
      case 'delete':
        removeIndex = this._getViewIndexByValue(repeat, value);
        viewOrPromise = viewSlot.removeAt(removeIndex, true);
        if (viewOrPromise instanceof Promise) {
          rmPromises.push(viewOrPromise);
        }
        break;
      case 'clear':
        viewSlot.removeAll(true);
        break;
      default:
        continue;
      }
    }

    if (rmPromises.length > 0) {
      Promise.all(rmPromises).then(() => {
        updateOverrideContexts(repeat.viewSlot.children, 0);
      });
    } else {
      updateOverrideContexts(repeat.viewSlot.children, 0);
    }
  }

  _getViewIndexByValue(repeat, value) {
    let viewSlot = repeat.viewSlot;
    let i;
    let ii;
    let child;

    for (i = 0, ii = viewSlot.children.length; i < ii; ++i) {
      child = viewSlot.children[i];
      if (child.bindingContext[repeat.local] === value) {
        return i;
      }
    }
  }
}
