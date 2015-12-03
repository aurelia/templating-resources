System.register([], function (_export) {
  "use strict";

  var NullRepeatStrategy;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  return {
    setters: [],
    execute: function () {
      NullRepeatStrategy = (function () {
        function NullRepeatStrategy() {
          _classCallCheck(this, NullRepeatStrategy);
        }

        NullRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, items) {
          repeat.viewSlot.removeAll(true);
        };

        NullRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver(observerLocator, items) {};

        return NullRepeatStrategy;
      })();

      _export("NullRepeatStrategy", NullRepeatStrategy);
    }
  };
});