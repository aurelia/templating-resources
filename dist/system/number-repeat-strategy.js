System.register(['./repeat-utilities'], function (_export) {
  'use strict';

  var createFullOverrideContext, updateOverrideContexts, NumberRepeatStrategy;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_repeatUtilities) {
      createFullOverrideContext = _repeatUtilities.createFullOverrideContext;
      updateOverrideContexts = _repeatUtilities.updateOverrideContexts;
    }],
    execute: function () {
      NumberRepeatStrategy = (function () {
        function NumberRepeatStrategy() {
          _classCallCheck(this, NumberRepeatStrategy);
        }

        NumberRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver() {
          return null;
        };

        NumberRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, value) {
          var _this = this;

          var removePromise = repeat.viewSlot.removeAll(true);
          if (removePromise instanceof Promise) {
            removePromise.then(function () {
              return _this._standardProcessItems(repeat, value);
            });
            return;
          }
          this._standardProcessItems(repeat, value);
        };

        NumberRepeatStrategy.prototype._standardProcessItems = function _standardProcessItems(repeat, value) {
          var viewFactory = repeat.viewFactory;
          var viewSlot = repeat.viewSlot;
          var childrenLength = viewSlot.children.length;
          var i = undefined;
          var ii = undefined;
          var overrideContext = undefined;
          var view = undefined;
          var viewsToRemove = undefined;

          value = Math.floor(value);
          viewsToRemove = childrenLength - value;

          if (viewsToRemove > 0) {
            if (viewsToRemove > childrenLength) {
              viewsToRemove = childrenLength;
            }

            for (i = 0, ii = viewsToRemove; i < ii; ++i) {
              viewSlot.removeAt(childrenLength - (i + 1), true);
            }

            return;
          }

          for (i = childrenLength, ii = value; i < ii; ++i) {
            overrideContext = createFullOverrideContext(repeat, i, i, ii);
            view = viewFactory.create();
            view.bind(overrideContext.bindingContext, overrideContext);
            viewSlot.add(view);
          }

          updateOverrideContexts(repeat.viewSlot.children, 0);
        };

        return NumberRepeatStrategy;
      })();

      _export('NumberRepeatStrategy', NumberRepeatStrategy);
    }
  };
});