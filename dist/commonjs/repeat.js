'use strict';

exports.__esModule = true;

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaBinding = require('aurelia-binding');

var _aureliaTemplating = require('aurelia-templating');

var Repeat = (function () {
  var _instanceInitializers = {};

  _createDecoratedClass(Repeat, [{
    key: 'items',
    decorators: [_aureliaTemplating.bindable],
    initializer: null,
    enumerable: true
  }, {
    key: 'local',
    decorators: [_aureliaTemplating.bindable],
    initializer: null,
    enumerable: true
  }, {
    key: 'key',
    decorators: [_aureliaTemplating.bindable],
    initializer: null,
    enumerable: true
  }, {
    key: 'value',
    decorators: [_aureliaTemplating.bindable],
    initializer: null,
    enumerable: true
  }], null, _instanceInitializers);

  function Repeat(viewFactory, viewSlot, observerLocator) {
    _classCallCheck(this, _Repeat);

    _defineDecoratedPropertyDescriptor(this, 'items', _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, 'local', _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, 'key', _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, 'value', _instanceInitializers);

    this.viewFactory = viewFactory;
    this.viewSlot = viewSlot;
    this.observerLocator = observerLocator;
    this.local = 'item';
    this.key = 'key';
    this.value = 'value';
  }

  Repeat.prototype.call = function call(context, changes) {
    this[context](this.items, changes);
  };

  Repeat.prototype.bind = function bind(bindingContext) {
    var items = this.items;
    var viewSlot = this.viewSlot;
    var observer = undefined;

    this.bindingContext = bindingContext;

    if (!items) {
      if (this.oldItems) {
        viewSlot.removeAll(true);
      }

      return;
    }

    if (this.oldItems === items) {
      if (items instanceof Map) {
        var records = _aureliaBinding.getChangeRecords(items);
        this.collectionObserver = this.observerLocator.getMapObserver(items);

        this.handleMapChangeRecords(items, records);

        this.callContext = 'handleMapChangeRecords';
        this.collectionObserver.subscribe(this.callContext, this);
      } else if (items instanceof Array) {
        var splices = _aureliaBinding.calcSplices(items, 0, items.length, this.lastBoundItems, 0, this.lastBoundItems.length);
        this.collectionObserver = this.observerLocator.getArrayObserver(items);

        this.handleSplices(items, splices);
        this.lastBoundItems = this.oldItems = null;

        this.callContext = 'handleSplices';
        this.collectionObserver.subscribe(this.callContext, this);
      }
      return;
    } else if (this.oldItems) {
      viewSlot.removeAll(true);
    }

    this.processItems();
  };

  Repeat.prototype.unbind = function unbind() {
    this.oldItems = this.items;

    if (this.items instanceof Array) {
      this.lastBoundItems = this.items.slice(0);
    }

    this.unsubscribeCollection();
  };

  Repeat.prototype.unsubscribeCollection = function unsubscribeCollection() {
    if (this.collectionObserver) {
      this.collectionObserver.unsubscribe(this.callContext, this);
      this.collectionObserver = null;
      this.callContext = null;
    }
  };

  Repeat.prototype.itemsChanged = function itemsChanged() {
    this.processItems();
  };

  Repeat.prototype.processItems = function processItems() {
    var _this = this;

    var items = this.items;
    var rmPromise = undefined;

    if (this.collectionObserver) {
      this.unsubscribeCollection();
      rmPromise = this.viewSlot.removeAll(true);
    }

    if (!items && items !== 0) {
      return;
    }

    if (rmPromise instanceof Promise) {
      rmPromise.then(function () {
        _this.processItemsByType();
      });
    } else {
      this.processItemsByType();
    }
  };

  Repeat.prototype.processItemsByType = function processItemsByType() {
    var items = this.items;
    if (items instanceof Array) {
      this.processArrayItems(items);
    } else if (items instanceof Map) {
      this.processMapEntries(items);
    } else if (typeof items === 'number') {
      this.processNumber(items);
    } else {
      throw new Error('Object in "repeat" must be of type Array, Map or Number');
    }
  };

  Repeat.prototype.processArrayItems = function processArrayItems(items) {
    var viewFactory = this.viewFactory;
    var viewSlot = this.viewSlot;
    var i = undefined;
    var ii = undefined;
    var row = undefined;
    var view = undefined;
    var observer = undefined;

    this.collectionObserver = this.observerLocator.getArrayObserver(items);

    for (i = 0, ii = items.length; i < ii; ++i) {
      row = this.createFullBindingContext(items[i], i, ii);
      view = viewFactory.create(row);
      viewSlot.add(view);
    }

    this.callContext = 'handleSplices';
    this.collectionObserver.subscribe(this.callContext, this);
  };

  Repeat.prototype.processMapEntries = function processMapEntries(items) {
    var _this2 = this;

    var viewFactory = this.viewFactory;
    var viewSlot = this.viewSlot;
    var index = 0;
    var row = undefined;
    var view = undefined;
    var observer = undefined;

    this.collectionObserver = this.observerLocator.getMapObserver(items);

    items.forEach(function (value, key) {
      row = _this2.createFullExecutionKvpContext(key, value, index, items.size);
      view = viewFactory.create(row);
      viewSlot.add(view);
      ++index;
    });

    this.callContext = 'handleMapChangeRecords';
    this.collectionObserver.subscribe(this.callContext, this);
  };

  Repeat.prototype.processNumber = function processNumber(value) {
    var viewFactory = this.viewFactory;
    var viewSlot = this.viewSlot;
    var childrenLength = viewSlot.children.length;
    var i = undefined;
    var ii = undefined;
    var row = undefined;
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
      row = this.createFullBindingContext(i, i, ii);
      view = viewFactory.create(row);
      viewSlot.add(view);
    }
  };

  Repeat.prototype.createBaseBindingContext = function createBaseBindingContext(data) {
    var context = {};
    context[this.local] = data;
    context.$parent = this.bindingContext;
    return context;
  };

  Repeat.prototype.createBaseExecutionKvpContext = function createBaseExecutionKvpContext(key, value) {
    var context = {};
    context[this.key] = key;
    context[this.value] = value;
    context.$parent = this.bindingContext;
    return context;
  };

  Repeat.prototype.createFullBindingContext = function createFullBindingContext(data, index, length) {
    var context = this.createBaseBindingContext(data);
    return this.updateBindingContext(context, index, length);
  };

  Repeat.prototype.createFullExecutionKvpContext = function createFullExecutionKvpContext(key, value, index, length) {
    var context = this.createBaseExecutionKvpContext(key, value);
    return this.updateBindingContext(context, index, length);
  };

  Repeat.prototype.updateBindingContext = function updateBindingContext(context, index, length) {
    var first = index === 0;
    var last = index === length - 1;
    var even = index % 2 === 0;

    context.$index = index;
    context.$first = first;
    context.$last = last;
    context.$middle = !(first || last);
    context.$odd = !even;
    context.$even = even;

    return context;
  };

  Repeat.prototype.updateBindingContexts = function updateBindingContexts(startIndex) {
    var children = this.viewSlot.children;
    var length = children.length;

    if (startIndex > 0) {
      startIndex = startIndex - 1;
    }

    for (; startIndex < length; ++startIndex) {
      this.updateBindingContext(children[startIndex].bindingContext, startIndex, length);
    }
  };

  Repeat.prototype.handleSplices = function handleSplices(array, splices) {
    var _this3 = this;

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
        var spliceIndexLow = _this3.handleAddedSplices(array, splices);
        _this3.updateBindingContexts(spliceIndexLow);
      });
    } else {
      var spliceIndexLow = this.handleAddedSplices(array, splices);
      this.updateBindingContexts(spliceIndexLow);
    }
  };

  Repeat.prototype.handleAddedSplices = function handleAddedSplices(array, splices) {
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
        var row = this.createFullBindingContext(array[addIndex], addIndex, arrayLength);
        var view = this.viewFactory.create(row);
        this.viewSlot.insert(addIndex, view);
      }
    }

    return spliceIndexLow;
  };

  Repeat.prototype.handleMapChangeRecords = function handleMapChangeRecords(map, records) {
    var viewSlot = this.viewSlot;
    var key = undefined;
    var i = undefined;
    var ii = undefined;
    var view = undefined;
    var children = undefined;
    var length = undefined;
    var row = undefined;
    var removeIndex = undefined;
    var record = undefined;

    for (i = 0, ii = records.length; i < ii; ++i) {
      record = records[i];
      key = record.key;
      switch (record.type) {
        case 'update':
          removeIndex = this.getViewIndexByKey(key);
          viewSlot.removeAt(removeIndex, true);
          row = this.createBaseExecutionKvpContext(key, map.get(key));
          view = this.viewFactory.create(row);
          viewSlot.insert(removeIndex, view);
          break;
        case 'add':
          row = this.createBaseExecutionKvpContext(key, map.get(key));
          view = this.viewFactory.create(row);
          viewSlot.insert(map.size, view);
          break;
        case 'delete':
          if (!record.oldValue) {
            return;
          }
          removeIndex = this.getViewIndexByKey(key);
          viewSlot.removeAt(removeIndex, true);
          break;
        case 'clear':
          viewSlot.removeAll(true);
          break;
        default:
          continue;
      }
    }

    children = viewSlot.children;
    length = children.length;

    for (i = 0; i < length; i++) {
      this.updateBindingContext(children[i].bindingContext, i, length);
    }
  };

  Repeat.prototype.getViewIndexByKey = function getViewIndexByKey(key) {
    var viewSlot = this.viewSlot;
    var i = undefined;
    var ii = undefined;
    var child = undefined;

    for (i = 0, ii = viewSlot.children.length; i < ii; ++i) {
      child = viewSlot.children[i];
      if (child.bindings[0].source[this.key] === key) {
        return i;
      }
    }
  };

  var _Repeat = Repeat;
  Repeat = _aureliaDependencyInjection.inject(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.ViewSlot, _aureliaBinding.ObserverLocator)(Repeat) || Repeat;
  Repeat = _aureliaTemplating.templateController(Repeat) || Repeat;
  Repeat = _aureliaTemplating.customAttribute('repeat')(Repeat) || Repeat;
  return Repeat;
})();

exports.Repeat = Repeat;