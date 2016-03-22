"use strict";

System.register([], function (_export, _context) {
  var NullRepeatStrategy;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [],
    execute: function () {
      _export("NullRepeatStrategy", NullRepeatStrategy = function () {
        function NullRepeatStrategy() {
          _classCallCheck(this, NullRepeatStrategy);
        }

        NullRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, items) {
          repeat.removeAllViews(true);
        };

        NullRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver(observerLocator, items) {};

        return NullRepeatStrategy;
      }());

      _export("NullRepeatStrategy", NullRepeatStrategy);
    }
  };
});