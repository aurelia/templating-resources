import {createFullOverrideContext, updateOverrideContexts} from './repeat-utilities';

/**
* A strategy for repeating a template over a Map.
*/
export class MapRepeatStrategy {
  /**
  * Gets a Map observer.
  * @param items The items to be observed.
  */
  getCollectionObserver(observerLocator, items) {
    return observerLocator.getMapObserver(items);
  }

  /**
  * Process the provided Map entries.
  * @param items The entries to process.
  */
  instanceChanged(repeat, items) {
    let viewFactory = repeat.viewFactory;
    let viewSlot = repeat.viewSlot;
    let index = 0;
    let overrideContext;
    let view;

    items.forEach((value, key) => {
      overrideContext = createFullOverrideContext(repeat, value, index, items.size, key);
      view = viewFactory.create();
      view.bind(overrideContext.bindingContext, overrideContext);
      viewSlot.add(view);
      ++index;
    });
  }

  /**
  * Handle changes in a Map collection.
  * @param map The underlying Map collection.
  * @param records The change records.
  */
  instanceMutated(repeat, map, records) {
    let viewSlot = repeat.viewSlot;
    let key;
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
      key = record.key;
      switch (record.type) {
      case 'update':
        removeIndex = this._getViewIndexByKey(repeat, key);
        viewOrPromise = viewSlot.removeAt(removeIndex, true);
        if (viewOrPromise instanceof Promise) {
          rmPromises.push(viewOrPromise);
        }
        overrideContext = createFullOverrideContext(repeat, map.get(key), removeIndex, map.size, key);
        view = repeat.viewFactory.create();
        view.bind(overrideContext.bindingContext, overrideContext);
        viewSlot.insert(removeIndex, view);
        break;
      case 'add':
        overrideContext = createFullOverrideContext(repeat, map.get(key), map.size - 1, map.size, key);
        view = repeat.viewFactory.create();
        view.bind(overrideContext.bindingContext, overrideContext);
        viewSlot.insert(map.size - 1, view);
        break;
      case 'delete':
        if (record.oldValue === undefined) { return; }
        removeIndex = this._getViewIndexByKey(repeat, key);
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

  _getViewIndexByKey(repeat, key) {
    let viewSlot = repeat.viewSlot;
    let i;
    let ii;
    let child;

    for (i = 0, ii = viewSlot.children.length; i < ii; ++i) {
      child = viewSlot.children[i];
      if (child.bindingContext[repeat.key] === key) {
        return i;
      }
    }
  }
}
