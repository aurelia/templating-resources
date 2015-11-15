'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaBinding = require('aurelia-binding');

var CollectionStrategy = (function () {
  function CollectionStrategy() {
    _classCallCheck(this, _CollectionStrategy);
  }

  CollectionStrategy.prototype.initialize = function initialize(repeat, bindingContext, overrideContext) {
    this.viewFactory = repeat.viewFactory;
    this.viewSlot = repeat.viewSlot;
    this.items = repeat.items;
    this.local = repeat.local;
    this.key = repeat.key;
    this.value = repeat.value;
    this.bindingContext = bindingContext;
    this.overrideContext = overrideContext;
  };

  CollectionStrategy.prototype.dispose = function dispose() {
    this.viewFactory = null;
    this.viewSlot = null;
    this.items = null;
    this.local = null;
    this.key = null;
    this.value = null;
    this.bindingContext = null;
    this.overrideContext = null;
  };

  CollectionStrategy.prototype.updateOverrideContexts = function updateOverrideContexts(startIndex) {
    var children = this.viewSlot.children;
    var length = children.length;

    if (startIndex > 0) {
      startIndex = startIndex - 1;
    }

    for (; startIndex < length; ++startIndex) {
      this.updateOverrideContext(children[startIndex].overrideContext, startIndex, length);
    }
  };

  CollectionStrategy.prototype.createFullOverrideContext = function createFullOverrideContext(data, index, length, key) {
    var overrideContext = this.createBaseOverrideContext(data, key);
    this.updateOverrideContext(overrideContext, index, length);
    return overrideContext;
  };

  CollectionStrategy.prototype.createBaseOverrideContext = function createBaseOverrideContext(data, key) {
    var bindingContext = {};
    var overrideContext = _aureliaBinding.createOverrideContext(bindingContext, this.overrideContext);

    if (typeof key !== 'undefined') {
      bindingContext[this.key] = key;
      bindingContext[this.value] = data;
    } else {
      bindingContext[this.local] = data;
    }

    return overrideContext;
  };

  CollectionStrategy.prototype.updateOverrideContext = function updateOverrideContext(overrideContext, index, length) {
    var first = index === 0;
    var last = index === length - 1;
    var even = index % 2 === 0;

    overrideContext.$index = index;
    overrideContext.$first = first;
    overrideContext.$last = last;
    overrideContext.$middle = !(first || last);
    overrideContext.$odd = !even;
    overrideContext.$even = even;
  };

  var _CollectionStrategy = CollectionStrategy;
  CollectionStrategy = _aureliaDependencyInjection.transient()(CollectionStrategy) || CollectionStrategy;
  return CollectionStrategy;
})();

exports.CollectionStrategy = CollectionStrategy;