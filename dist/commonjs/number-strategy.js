'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _collectionStrategy = require('./collection-strategy');

var NumberStrategy = (function (_CollectionStrategy) {
  _inherits(NumberStrategy, _CollectionStrategy);

  function NumberStrategy() {
    _classCallCheck(this, NumberStrategy);

    _CollectionStrategy.apply(this, arguments);
  }

  NumberStrategy.prototype.getCollectionObserver = function getCollectionObserver() {
    return;
  };

  NumberStrategy.prototype.processItems = function processItems(value) {
    var viewFactory = this.viewFactory;
    var viewSlot = this.viewSlot;
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
      overrideContext = this.createFullOverrideContext(i, i, ii);
      view = viewFactory.create();
      view.bind(overrideContext.bindingContext, overrideContext);
      viewSlot.add(view);
    }

    this.updateOverrideContexts(0);
  };

  return NumberStrategy;
})(_collectionStrategy.CollectionStrategy);

exports.NumberStrategy = NumberStrategy;