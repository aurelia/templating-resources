System.register(['aurelia-dependency-injection', 'aurelia-binding', './collection-strategy'], function (_export) {
  'use strict';

  var inject, ObserverLocator, CollectionStrategy, MapCollectionStrategy;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  return {
    setters: [function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_aureliaBinding) {
      ObserverLocator = _aureliaBinding.ObserverLocator;
    }, function (_collectionStrategy) {
      CollectionStrategy = _collectionStrategy.CollectionStrategy;
    }],
    execute: function () {
      MapCollectionStrategy = (function (_CollectionStrategy) {
        _inherits(MapCollectionStrategy, _CollectionStrategy);

        function MapCollectionStrategy(observerLocator) {
          _classCallCheck(this, _MapCollectionStrategy);

          _CollectionStrategy.call(this);
          this.observerLocator = observerLocator;
        }

        MapCollectionStrategy.prototype.getCollectionObserver = function getCollectionObserver(items) {
          return this.observerLocator.getMapObserver(items);
        };

        MapCollectionStrategy.prototype.processItems = function processItems(items) {
          var _this = this;

          var viewFactory = this.viewFactory;
          var viewSlot = this.viewSlot;
          var index = 0;
          var overrideContext = undefined;
          var view = undefined;

          items.forEach(function (value, key) {
            overrideContext = _this.createFullOverrideContext(value, index, items.size, key);
            view = viewFactory.create();
            view.bind(overrideContext.bindingContext, overrideContext);
            viewSlot.add(view);
            ++index;
          });
        };

        MapCollectionStrategy.prototype.handleChanges = function handleChanges(map, records) {
          var _this2 = this;

          var viewSlot = this.viewSlot;
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
                removeIndex = this._getViewIndexByKey(key);
                viewOrPromise = viewSlot.removeAt(removeIndex, true);
                if (viewOrPromise instanceof Promise) {
                  rmPromises.push(viewOrPromise);
                }
                overrideContext = this.createFullOverrideContext(map.get(key), removeIndex, map.size, key);
                view = this.viewFactory.create();
                view.bind(overrideContext.bindingContext, overrideContext);
                viewSlot.insert(removeIndex, view);
                break;
              case 'add':
                overrideContext = this.createFullOverrideContext(map.get(key), map.size - 1, map.size, key);
                view = this.viewFactory.create();
                view.bind(overrideContext.bindingContext, overrideContext);
                viewSlot.insert(map.size - 1, view);
                break;
              case 'delete':
                if (record.oldValue === undefined) {
                  return;
                }
                removeIndex = this._getViewIndexByKey(key);
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
              _this2.updateOverrideContexts(0);
            });
          } else {
            this.updateOverrideContexts(0);
          }
        };

        MapCollectionStrategy.prototype._getViewIndexByKey = function _getViewIndexByKey(key) {
          var viewSlot = this.viewSlot;
          var i = undefined;
          var ii = undefined;
          var child = undefined;

          for (i = 0, ii = viewSlot.children.length; i < ii; ++i) {
            child = viewSlot.children[i];
            if (child.overrideContext[this.key] === key) {
              return i;
            }
          }
        };

        var _MapCollectionStrategy = MapCollectionStrategy;
        MapCollectionStrategy = inject(ObserverLocator)(MapCollectionStrategy) || MapCollectionStrategy;
        return MapCollectionStrategy;
      })(CollectionStrategy);

      _export('MapCollectionStrategy', MapCollectionStrategy);
    }
  };
});