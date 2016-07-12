'use strict';

System.register(['./repeat-utilities'], function (_export, _context) {
  "use strict";

  var createFullOverrideContext, updateOverrideContexts, NumberRepeatStrategy;

  

  return {
    setters: [function (_repeatUtilities) {
      createFullOverrideContext = _repeatUtilities.createFullOverrideContext;
      updateOverrideContexts = _repeatUtilities.updateOverrideContexts;
    }],
    execute: function () {
      _export('NumberRepeatStrategy', NumberRepeatStrategy = function () {
        function NumberRepeatStrategy() {
          
        }

        NumberRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver() {
          return null;
        };

        NumberRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, value) {
          var _this = this;

          var removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
          if (removePromise instanceof Promise) {
            removePromise.then(function () {
              return _this._standardProcessItems(repeat, value);
            });
            return;
          }
          this._standardProcessItems(repeat, value);
        };

        NumberRepeatStrategy.prototype._standardProcessItems = function _standardProcessItems(repeat, value) {
          var childrenLength = repeat.viewCount();
          var i = void 0;
          var ii = void 0;
          var overrideContext = void 0;
          var viewsToRemove = void 0;

          value = Math.floor(value);
          viewsToRemove = childrenLength - value;

          if (viewsToRemove > 0) {
            if (viewsToRemove > childrenLength) {
              viewsToRemove = childrenLength;
            }

            for (i = 0, ii = viewsToRemove; i < ii; ++i) {
              repeat.removeView(childrenLength - (i + 1), true, !repeat.viewsRequireLifecycle);
            }

            return;
          }

          for (i = childrenLength, ii = value; i < ii; ++i) {
            overrideContext = createFullOverrideContext(repeat, i, i, ii);
            repeat.addView(overrideContext.bindingContext, overrideContext);
          }

          updateOverrideContexts(repeat.views(), 0);
        };

        return NumberRepeatStrategy;
      }());

      _export('NumberRepeatStrategy', NumberRepeatStrategy);
    }
  };
});