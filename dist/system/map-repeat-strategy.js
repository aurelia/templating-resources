'use strict';

System.register(['./repeat-utilities'], function (_export, _context) {
  var createFullOverrideContext, updateOverrideContexts, MapRepeatStrategy;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_repeatUtilities) {
      createFullOverrideContext = _repeatUtilities.createFullOverrideContext;
      updateOverrideContexts = _repeatUtilities.updateOverrideContexts;
    }],
    execute: function () {
      _export('MapRepeatStrategy', MapRepeatStrategy = function () {
        function MapRepeatStrategy() {
          _classCallCheck(this, MapRepeatStrategy);
        }

        MapRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver(observerLocator, items) {
          return observerLocator.getMapObserver(items);
        };

        MapRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, items) {
          var _this = this;

          var removePromise = repeat.removeAllViews(true);
          if (removePromise instanceof Promise) {
            removePromise.then(function () {
              return _this._standardProcessItems(repeat, items);
            });
            return;
          }
          this._standardProcessItems(repeat, items);
        };

        MapRepeatStrategy.prototype._standardProcessItems = function _standardProcessItems(repeat, items) {
          var index = 0;
          var overrideContext = void 0;

          items.forEach(function (value, key) {
            overrideContext = createFullOverrideContext(repeat, value, index, items.size, key);
            repeat.addView(overrideContext.bindingContext, overrideContext);
            ++index;
          });
        };

        MapRepeatStrategy.prototype.instanceMutated = function instanceMutated(repeat, map, records) {
          var key = void 0;
          var i = void 0;
          var ii = void 0;
          var overrideContext = void 0;
          var removeIndex = void 0;
          var record = void 0;
          var rmPromises = [];
          var viewOrPromise = void 0;

          for (i = 0, ii = records.length; i < ii; ++i) {
            record = records[i];
            key = record.key;
            switch (record.type) {
              case 'update':
                removeIndex = this._getViewIndexByKey(repeat, key);
                viewOrPromise = repeat.removeView(removeIndex, true);
                if (viewOrPromise instanceof Promise) {
                  rmPromises.push(viewOrPromise);
                }
                overrideContext = createFullOverrideContext(repeat, map.get(key), removeIndex, map.size, key);
                repeat.insertView(removeIndex, overrideContext.bindingContext, overrideContext);
                break;
              case 'add':
                overrideContext = createFullOverrideContext(repeat, map.get(key), map.size - 1, map.size, key);
                repeat.insertView(map.size - 1, overrideContext.bindingContext, overrideContext);
                break;
              case 'delete':
                if (record.oldValue === undefined) {
                  return;
                }
                removeIndex = this._getViewIndexByKey(repeat, key);
                viewOrPromise = repeat.removeView(removeIndex, true);
                if (viewOrPromise instanceof Promise) {
                  rmPromises.push(viewOrPromise);
                }
                break;
              case 'clear':
                repeat.removeAllViews(true);
                break;
              default:
                continue;
            }
          }

          if (rmPromises.length > 0) {
            Promise.all(rmPromises).then(function () {
              updateOverrideContexts(repeat.views(), 0);
            });
          } else {
            updateOverrideContexts(repeat.views(), 0);
          }
        };

        MapRepeatStrategy.prototype._getViewIndexByKey = function _getViewIndexByKey(repeat, key) {
          var i = void 0;
          var ii = void 0;
          var child = void 0;

          for (i = 0, ii = repeat.viewCount(); i < ii; ++i) {
            child = repeat.view(i);
            if (child.bindingContext[repeat.key] === key) {
              return i;
            }
          }
        };

        return MapRepeatStrategy;
      }());

      _export('MapRepeatStrategy', MapRepeatStrategy);
    }
  };
});