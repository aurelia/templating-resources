"use strict";

System.register([], function (_export, _context) {
  "use strict";

  var NullRepeatStrategy;

  

  return {
    setters: [],
    execute: function () {
      _export("NullRepeatStrategy", NullRepeatStrategy = function () {
        function NullRepeatStrategy() {
          
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