var _dec, _dec2, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _initializerWarningHelper(descriptor, context) {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

import { inject } from 'aurelia-dependency-injection';
import { ObserverLocator } from 'aurelia-binding';
import { BoundViewFactory, TargetInstruction, ViewSlot, ViewResources, customAttribute, bindable, templateController } from 'aurelia-templating';
import { RepeatStrategyLocator } from './repeat-strategy-locator';
import { getItemsSourceExpression, unwrapExpression, isOneTime, updateOneTimeBinding } from './repeat-utilities';
import { viewsRequireLifecycle } from './analyze-view-factory';
import { AbstractRepeater } from './abstract-repeater';

export let Repeat = (_dec = customAttribute('repeat'), _dec2 = inject(BoundViewFactory, TargetInstruction, ViewSlot, ViewResources, ObserverLocator, RepeatStrategyLocator), _dec(_class = templateController(_class = _dec2(_class = (_class2 = class Repeat extends AbstractRepeater {
  constructor(viewFactory, instruction, viewSlot, viewResources, observerLocator, strategyLocator) {
    super({
      local: 'item',
      viewsRequireLifecycle: viewsRequireLifecycle(viewFactory)
    });

    _initDefineProp(this, 'items', _descriptor, this);

    _initDefineProp(this, 'local', _descriptor2, this);

    _initDefineProp(this, 'key', _descriptor3, this);

    _initDefineProp(this, 'value', _descriptor4, this);

    this.viewFactory = viewFactory;
    this.instruction = instruction;
    this.viewSlot = viewSlot;
    this.lookupFunctions = viewResources.lookupFunctions;
    this.observerLocator = observerLocator;
    this.key = 'key';
    this.value = 'value';
    this.strategyLocator = strategyLocator;
    this.ignoreMutation = false;
    this.sourceExpression = getItemsSourceExpression(this.instruction, 'repeat.for');
    this.isOneTime = isOneTime(this.sourceExpression);
    this.viewsRequireLifecycle = viewsRequireLifecycle(viewFactory);
  }

  call(context, changes) {
    this[context](this.items, changes);
  }

  bind(bindingContext, overrideContext) {
    this.scope = { bindingContext, overrideContext };
    this.matcherBinding = this._captureAndRemoveMatcherBinding();
    this.itemsChanged();
  }

  unbind() {
    this.scope = null;
    this.items = null;
    this.matcherBinding = null;
    this.viewSlot.removeAll(true, true);
    this._unsubscribeCollection();
  }

  _unsubscribeCollection() {
    if (this.collectionObserver) {
      this.collectionObserver.unsubscribe(this.callContext, this);
      this.collectionObserver = null;
      this.callContext = null;
    }
  }

  itemsChanged() {
    this._unsubscribeCollection();

    if (!this.scope) {
      return;
    }

    let items = this.items;
    this.strategy = this.strategyLocator.getStrategy(items);
    if (!this.strategy) {
      throw new Error(`Value for '${this.sourceExpression}' is non-repeatable`);
    }

    if (!this.isOneTime && !this._observeInnerCollection()) {
      this._observeCollection();
    }
    this.ignoreMutation = true;
    this.strategy.instanceChanged(this, items);
    this.observerLocator.taskQueue.queueMicroTask(() => {
      this.ignoreMutation = false;
    });
  }

  _getInnerCollection() {
    let expression = unwrapExpression(this.sourceExpression);
    if (!expression) {
      return null;
    }
    return expression.evaluate(this.scope, null);
  }

  handleCollectionMutated(collection, changes) {
    if (!this.collectionObserver) {
      return;
    }
    if (this.ignoreMutation) {
      return;
    }
    this.strategy.instanceMutated(this, collection, changes);
  }

  handleInnerCollectionMutated(collection, changes) {
    if (!this.collectionObserver) {
      return;
    }

    if (this.ignoreMutation) {
      return;
    }
    this.ignoreMutation = true;
    let newItems = this.sourceExpression.evaluate(this.scope, this.lookupFunctions);
    this.observerLocator.taskQueue.queueMicroTask(() => this.ignoreMutation = false);

    if (newItems === this.items) {
      this.itemsChanged();
    } else {
      this.items = newItems;
    }
  }

  _observeInnerCollection() {
    let items = this._getInnerCollection();
    let strategy = this.strategyLocator.getStrategy(items);
    if (!strategy) {
      return false;
    }
    this.collectionObserver = strategy.getCollectionObserver(this.observerLocator, items);
    if (!this.collectionObserver) {
      return false;
    }
    this.callContext = 'handleInnerCollectionMutated';
    this.collectionObserver.subscribe(this.callContext, this);
    return true;
  }

  _observeCollection() {
    let items = this.items;
    this.collectionObserver = this.strategy.getCollectionObserver(this.observerLocator, items);
    if (this.collectionObserver) {
      this.callContext = 'handleCollectionMutated';
      this.collectionObserver.subscribe(this.callContext, this);
    }
  }

  _captureAndRemoveMatcherBinding() {
    if (this.viewFactory.viewFactory) {
      const instructions = this.viewFactory.viewFactory.instructions;
      const instructionIds = Object.keys(instructions);
      for (let i = 0; i < instructionIds.length; i++) {
        const expressions = instructions[instructionIds[i]].expressions;
        if (expressions) {
          for (let ii = 0; i < expressions.length; i++) {
            if (expressions[ii].targetProperty === 'matcher') {
              const matcherBinding = expressions[ii];
              expressions.splice(ii, 1);
              return matcherBinding;
            }
          }
        }
      }
    }

    return undefined;
  }

  viewCount() {
    return this.viewSlot.children.length;
  }
  views() {
    return this.viewSlot.children;
  }
  view(index) {
    return this.viewSlot.children[index];
  }
  matcher() {
    return this.matcherBinding ? this.matcherBinding.sourceExpression.evaluate(this.scope, this.matcherBinding.lookupFunctions) : null;
  }

  addView(bindingContext, overrideContext) {
    let view = this.viewFactory.create();
    view.bind(bindingContext, overrideContext);
    this.viewSlot.add(view);
  }

  insertView(index, bindingContext, overrideContext) {
    let view = this.viewFactory.create();
    view.bind(bindingContext, overrideContext);
    this.viewSlot.insert(index, view);
  }

  moveView(sourceIndex, targetIndex) {
    this.viewSlot.move(sourceIndex, targetIndex);
  }

  removeAllViews(returnToCache, skipAnimation) {
    return this.viewSlot.removeAll(returnToCache, skipAnimation);
  }

  removeViews(viewsToRemove, returnToCache, skipAnimation) {
    return this.viewSlot.removeMany(viewsToRemove, returnToCache, skipAnimation);
  }

  removeView(index, returnToCache, skipAnimation) {
    return this.viewSlot.removeAt(index, returnToCache, skipAnimation);
  }

  updateBindings(view) {
    let j = view.bindings.length;
    while (j--) {
      updateOneTimeBinding(view.bindings[j]);
    }
    j = view.controllers.length;
    while (j--) {
      let k = view.controllers[j].boundProperties.length;
      while (k--) {
        let binding = view.controllers[j].boundProperties[k].binding;
        updateOneTimeBinding(binding);
      }
    }
  }
}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'items', [bindable], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'local', [bindable], {
  enumerable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'key', [bindable], {
  enumerable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'value', [bindable], {
  enumerable: true,
  initializer: null
})), _class2)) || _class) || _class) || _class);