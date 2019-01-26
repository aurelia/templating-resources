var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3;

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

import { BoundViewFactory, ViewSlot, bindable, customAttribute, templateController } from 'aurelia-templating';
import { inject } from 'aurelia-dependency-injection';
import { IfCore } from './if-core';

export let If = (_dec = customAttribute('if'), _dec2 = inject(BoundViewFactory, ViewSlot), _dec3 = bindable({ primaryProperty: true }), _dec(_class = templateController(_class = _dec2(_class = (_class2 = class If extends IfCore {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), _initDefineProp(this, 'condition', _descriptor, this), _initDefineProp(this, 'swapOrder', _descriptor2, this), _initDefineProp(this, 'cache', _descriptor3, this), _temp;
  }

  bind(bindingContext, overrideContext) {
    super.bind(bindingContext, overrideContext);
    if (this.condition) {
      this._show();
    } else {
      this._hide();
    }
  }

  conditionChanged(newValue) {
    this._update(newValue);
  }

  _update(show) {
    if (this.animating) {
      return;
    }

    let promise;
    if (this.elseVm) {
      promise = show ? this._swap(this.elseVm, this) : this._swap(this, this.elseVm);
    } else {
      promise = show ? this._show() : this._hide();
    }

    if (promise) {
      this.animating = true;
      promise.then(() => {
        this.animating = false;
        if (this.condition !== this.showing) {
          this._update(this.condition);
        }
      });
    }
  }

  _swap(remove, add) {
    switch (this.swapOrder) {
      case 'before':
        return Promise.resolve(add._show()).then(() => remove._hide());
      case 'with':
        return Promise.all([remove._hide(), add._show()]);
      default:
        let promise = remove._hide();
        return promise ? promise.then(() => add._show()) : add._show();
    }
  }
}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'condition', [_dec3], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'swapOrder', [bindable], {
  enumerable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'cache', [bindable], {
  enumerable: true,
  initializer: function () {
    return true;
  }
})), _class2)) || _class) || _class) || _class);