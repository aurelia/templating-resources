define(['exports', 'aurelia-dependency-injection', 'aurelia-binding', 'aurelia-templating', './collection-strategy-locator'], function (exports, _aureliaDependencyInjection, _aureliaBinding, _aureliaTemplating, _collectionStrategyLocator) {
  'use strict';

  exports.__esModule = true;

  var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

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

    function Repeat(viewFactory, instruction, viewSlot, viewResources, observerLocator, collectionStrategyLocator) {
      _classCallCheck(this, _Repeat);

      _defineDecoratedPropertyDescriptor(this, 'items', _instanceInitializers);

      _defineDecoratedPropertyDescriptor(this, 'local', _instanceInitializers);

      _defineDecoratedPropertyDescriptor(this, 'key', _instanceInitializers);

      _defineDecoratedPropertyDescriptor(this, 'value', _instanceInitializers);

      this.viewFactory = viewFactory;
      this.instruction = instruction;
      this.viewSlot = viewSlot;
      this.lookupFunctions = viewResources.lookupFunctions;
      this.observerLocator = observerLocator;
      this.local = 'item';
      this.key = 'key';
      this.value = 'value';
      this.collectionStrategyLocator = collectionStrategyLocator;
      this.ignoreMutation = false;
    }

    Repeat.prototype.call = function call(context, changes) {
      this[context](this.items, changes);
    };

    Repeat.prototype.bind = function bind(bindingContext, overrideContext) {
      var items = this.items;
      this.sourceExpression = getSourceExpression(this.instruction, 'repeat.for');
      this.scope = { bindingContext: bindingContext, overrideContext: overrideContext };
      if (items === undefined || items === null) {
        return;
      }
      this.processItems();
    };

    Repeat.prototype.unbind = function unbind() {
      this.sourceExpression = null;
      this.scope = null;
      if (this.collectionStrategy) {
        this.collectionStrategy.dispose();
      }
      this.items = null;
      this.collectionStrategy = null;
      this.viewSlot.removeAll(true);
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

      this.unsubscribeCollection();
      var rmPromise = this.viewSlot.removeAll(true);
      if (this.collectionStrategy) {
        this.collectionStrategy.dispose();
      }

      if (!items && items !== 0) {
        return;
      }

      var bindingContext = undefined;
      var overrideContext = undefined;
      if (this.scope) {
        bindingContext = this.scope.bindingContext;
        overrideContext = this.scope.overrideContext;
      }

      this.collectionStrategy = this.collectionStrategyLocator.getStrategy(items);
      this.collectionStrategy.initialize(this, bindingContext, overrideContext);

      if (rmPromise instanceof Promise) {
        rmPromise.then(function () {
          _this.processItemsByStrategy();
        });
      } else {
        this.processItemsByStrategy();
      }
    };

    Repeat.prototype.getInnerCollection = function getInnerCollection() {
      var expression = unwrapExpression(this.sourceExpression);
      if (!expression) {
        return null;
      }
      return expression.evaluate(this.scope, null);
    };

    Repeat.prototype.observeInnerCollection = function observeInnerCollection() {
      var items = this.getInnerCollection();
      if (items instanceof Array) {
        this.collectionObserver = this.observerLocator.getArrayObserver(items);
      } else if (items instanceof Map) {
        this.collectionObserver = this.observerLocator.getMapObserver(items);
      } else {
        return false;
      }
      this.callContext = 'handleInnerCollectionChanges';
      this.collectionObserver.subscribe(this.callContext, this);
      return true;
    };

    Repeat.prototype.observeCollection = function observeCollection() {
      var items = this.items;
      this.collectionObserver = this.collectionStrategy.getCollectionObserver(items);
      if (this.collectionObserver) {
        this.callContext = 'handleCollectionChanges';
        this.collectionObserver.subscribe(this.callContext, this);
      }
    };

    Repeat.prototype.processItemsByStrategy = function processItemsByStrategy() {
      if (!this.observeInnerCollection()) {
        this.observeCollection();
      }
      this.collectionStrategy.processItems(this.items);
    };

    Repeat.prototype.handleCollectionChanges = function handleCollectionChanges(collection, changes) {
      this.collectionStrategy.handleChanges(collection, changes);
    };

    Repeat.prototype.handleInnerCollectionChanges = function handleInnerCollectionChanges(collection, changes) {
      var _this2 = this;

      if (this.ignoreMutation) {
        return;
      }
      this.ignoreMutation = true;
      var newItems = this.sourceExpression.evaluate(this.scope, this.lookupFunctions);
      this.observerLocator.taskQueue.queueMicroTask(function () {
        return _this2.ignoreMutation = false;
      });

      if (newItems === this.items) {
        return;
      }
      this.items = newItems;
      this.itemsChanged();
    };

    var _Repeat = Repeat;
    Repeat = _aureliaDependencyInjection.inject(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.TargetInstruction, _aureliaTemplating.ViewSlot, _aureliaTemplating.ViewResources, _aureliaBinding.ObserverLocator, _collectionStrategyLocator.CollectionStrategyLocator)(Repeat) || Repeat;
    Repeat = _aureliaTemplating.templateController(Repeat) || Repeat;
    Repeat = _aureliaTemplating.customAttribute('repeat')(Repeat) || Repeat;
    return Repeat;
  })();

  exports.Repeat = Repeat;

  function getSourceExpression(instruction, attrName) {
    return instruction.behaviorInstructions.filter(function (bi) {
      return bi.originalAttrName === attrName;
    })[0].attributes.items.sourceExpression;
  }

  function unwrapExpression(expression) {
    var unwrapped = false;
    while (expression instanceof _aureliaBinding.BindingBehavior) {
      expression = expression.expression;
    }
    while (expression instanceof _aureliaBinding.ValueConverter) {
      expression = expression.expression;
      unwrapped = true;
    }
    return unwrapped ? expression : null;
  }
});