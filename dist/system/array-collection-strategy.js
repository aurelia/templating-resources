System.register(['./collection-strategy'], function (_export) {
  'use strict';

  var CollectionStrategy, ArrayCollectionStrategy;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  return {
    setters: [function (_collectionStrategy) {
      CollectionStrategy = _collectionStrategy.CollectionStrategy;
    }],
    execute: function () {
      ArrayCollectionStrategy = (function (_CollectionStrategy) {
        _inherits(ArrayCollectionStrategy, _CollectionStrategy);

        function ArrayCollectionStrategy() {
          _classCallCheck(this, ArrayCollectionStrategy);

          _CollectionStrategy.apply(this, arguments);
        }

        ArrayCollectionStrategy.prototype.processItems = function processItems(items) {
          var i = undefined;
          var ii = undefined;
          var overrideContext = undefined;
          var view = undefined;
          this.items = items;
          for (i = 0, ii = items.length; i < ii; ++i) {
            overrideContext = _CollectionStrategy.prototype.createFullOverrideContext.call(this, items[i], i, ii);
            view = this.viewFactory.create();
            view.bind(undefined, overrideContext);
            this.viewSlot.add(view);
          }
        };

        ArrayCollectionStrategy.prototype.getCollectionObserver = function getCollectionObserver(items) {
          return this.observerLocator.getArrayObserver(items);
        };

        ArrayCollectionStrategy.prototype.handleChanges = function handleChanges(array, splices) {
          var _this = this;

          var removeDelta = 0;
          var viewSlot = this.viewSlot;
          var rmPromises = [];

          for (var i = 0, ii = splices.length; i < ii; ++i) {
            var splice = splices[i];
            var removed = splice.removed;

            for (var j = 0, jj = removed.length; j < jj; ++j) {
              var viewOrPromise = viewSlot.removeAt(splice.index + removeDelta + rmPromises.length, true);
              if (viewOrPromise instanceof Promise) {
                rmPromises.push(viewOrPromise);
              }
            }
            removeDelta -= splice.addedCount;
          }

          if (rmPromises.length > 0) {
            Promise.all(rmPromises).then(function () {
              var spliceIndexLow = _this._handleAddedSplices(array, splices);
              _this.updateOverrideContexts(spliceIndexLow);
            });
          } else {
            var spliceIndexLow = this._handleAddedSplices(array, splices);
            _CollectionStrategy.prototype.updateOverrideContexts.call(this, spliceIndexLow);
          }
        };

        ArrayCollectionStrategy.prototype._handleAddedSplices = function _handleAddedSplices(array, splices) {
          var spliceIndex = undefined;
          var spliceIndexLow = undefined;
          var arrayLength = array.length;
          for (var i = 0, ii = splices.length; i < ii; ++i) {
            var splice = splices[i];
            var addIndex = spliceIndex = splice.index;
            var end = splice.index + splice.addedCount;

            if (typeof spliceIndexLow === 'undefined' || spliceIndexLow === null || spliceIndexLow > splice.index) {
              spliceIndexLow = spliceIndex;
            }

            for (; addIndex < end; ++addIndex) {
              var overrideContext = this.createFullOverrideContext(array[addIndex], addIndex, arrayLength);
              var view = this.viewFactory.create();
              view.bind(undefined, overrideContext);
              this.viewSlot.insert(addIndex, view);
            }
          }

          return spliceIndexLow;
        };

        return ArrayCollectionStrategy;
      })(CollectionStrategy);

      _export('ArrayCollectionStrategy', ArrayCollectionStrategy);
    }
  };
});