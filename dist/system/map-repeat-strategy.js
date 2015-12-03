System.register(['./repeat-utilities'], function (_export) {
  'use strict';

  var createFullOverrideContext, updateOverrideContexts, MapRepeatStrategy;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_repeatUtilities) {
      createFullOverrideContext = _repeatUtilities.createFullOverrideContext;
      updateOverrideContexts = _repeatUtilities.updateOverrideContexts;
    }],
    execute: function () {
      MapRepeatStrategy = (function () {
        function MapRepeatStrategy() {
          _classCallCheck(this, MapRepeatStrategy);
        }

        MapRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver(observerLocator, items) {
          return observerLocator.getMapObserver(items);
        };

        MapRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, items) {
          var _this = this;

          var removePromise = repeat.viewSlot.removeAll(true);
          if (removePromise instanceof Promise) {
            removePromise.then(function () {
              return _this._standardProcessItems(repeat, items);
            });
            return;
          }
          this._standardProcessItems(repeat, items);
        };

        MapRepeatStrategy.prototype._standardProcessItems = function _standardProcessItems(repeat, items) {
          var viewFactory = repeat.viewFactory;
          var viewSlot = repeat.viewSlot;
          var index = 0;
          var overrideContext = undefined;
          var view = undefined;

          items.forEach(function (value, key) {
            overrideContext = createFullOverrideContext(repeat, value, index, items.size, key);
            view = viewFactory.create();
            view.bind(overrideContext.bindingContext, overrideContext);
            viewSlot.add(view);
            ++index;
          });
        };

        MapRepeatStrategy.prototype.instanceMutated = function instanceMutated(repeat, map, records) {
          var viewSlot = repeat.viewSlot;
          var key = undefined;
          var i = undefined;
          var ii = undefined;
          var view = undefined;
          var overrideContext = undefined;
          var removeIndex = undefined;
          var record = undefined;
          var rmPromises = [];
          var viewOrPromise = undefined;

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
                if (record.oldValue === undefined) {
                  return;
                }
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
            Promise.all(rmPromises).then(function () {
              updateOverrideContexts(repeat.viewSlot.children, 0);
            });
          } else {
            updateOverrideContexts(repeat.viewSlot.children, 0);
          }
        };

        MapRepeatStrategy.prototype._getViewIndexByKey = function _getViewIndexByKey(repeat, key) {
          var viewSlot = repeat.viewSlot;
          var i = undefined;
          var ii = undefined;
          var child = undefined;

          for (i = 0, ii = viewSlot.children.length; i < ii; ++i) {
            child = viewSlot.children[i];
            if (child.bindingContext[repeat.key] === key) {
              return i;
            }
          }
        };

        return MapRepeatStrategy;
      })();

      _export('MapRepeatStrategy', MapRepeatStrategy);
    }
  };
});