var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor, _descriptor2, _dec4, _dec5, _class4;

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

export var IfCore = function () {
  function IfCore(viewFactory, viewSlot) {
    

    this.viewFactory = viewFactory;
    this.viewSlot = viewSlot;
    this.view = null;
    this.bindingContext = null;
    this.overrideContext = null;

    this.showing = false;
  }

  IfCore.prototype.bind = function bind(bindingContext, overrideContext) {
    this.bindingContext = bindingContext;
    this.overrideContext = overrideContext;
  };

  IfCore.prototype.unbind = function unbind() {
    if (this.view === null) {
      return;
    }

    this.view.unbind();

    if (!this.viewFactory.isCaching) {
      return;
    }

    if (this.showing) {
      this.showing = false;
      this.viewSlot.remove(this.view, true, true);
    } else {
      this.view.returnToCache();
    }

    this.view = null;
  };

  IfCore.prototype._show = function _show() {
    if (this.showing) {
      return;
    }

    if (this.view === null) {
      this.view = this.viewFactory.create();
    }

    if (!this.view.isBound) {
      this.view.bind(this.bindingContext, this.overrideContext);
    }

    this.showing = true;
    return this.viewSlot.add(this.view);
  };

  IfCore.prototype._hide = function _hide() {
    var _this = this;

    if (!this.showing) {
      return;
    }

    this.showing = false;
    var removed = this.viewSlot.remove(this.view);

    if (removed instanceof Promise) {
      return removed.then(function () {
        return _this.view.unbind();
      });
    }

    this.view.unbind();
  };

  return IfCore;
}();

export var If = (_dec = customAttribute('if'), _dec2 = inject(BoundViewFactory, ViewSlot), _dec3 = bindable({ primaryProperty: true }), _dec(_class = templateController(_class = _dec2(_class = (_class2 = function (_IfCore) {
  _inherits(If, _IfCore);

  function If() {
    var _temp, _this2, _ret;

    

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this2 = _possibleConstructorReturn(this, _IfCore.call.apply(_IfCore, [this].concat(args))), _this2), _initDefineProp(_this2, 'condition', _descriptor, _this2), _initDefineProp(_this2, 'swapOrder', _descriptor2, _this2), _temp), _possibleConstructorReturn(_this2, _ret);
  }

  If.prototype.bind = function bind(bindingContext, overrideContext) {
    _IfCore.prototype.bind.call(this, bindingContext, overrideContext);
    this.conditionChanged(this.condition);
  };

  If.prototype.conditionChanged = function conditionChanged(newValue) {
    this._update(newValue);
  };

  If.prototype._update = function _update(show) {
    var _this3 = this;

    if (this.animating) {
      return;
    }

    var promise = void 0;
    if (this.else) {
      promise = show ? this._swap(this.else, this) : this._swap(this, this.else);
    } else {
      promise = show ? this._show() : this._hide();
    }

    if (promise) {
      this.animating = true;
      promise.then(function () {
        _this3.animating = false;
        if (_this3.condition !== _this3.showing) {
          _this3._update(_this3.condition);
        }
      });
    }
  };

  If.prototype._swap = function _swap(remove, add) {
    switch (this.swapOrder) {
      case 'before':
        return Promise.resolve(add._show()).then(function () {
          return remove._hide();
        });
      case 'with':
        return Promise.all([remove._hide(), add._show()]);
      default:
        var promise = remove._hide();
        return promise ? promise.then(function () {
          return add._show();
        }) : add._show();
    }
  };

  return If;
}(IfCore), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'condition', [_dec3], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'swapOrder', [bindable], {
  enumerable: true,
  initializer: null
})), _class2)) || _class) || _class) || _class);

export var Else = (_dec4 = customAttribute('else'), _dec5 = inject(BoundViewFactory, ViewSlot), _dec4(_class4 = templateController(_class4 = _dec5(_class4 = function (_IfCore2) {
  _inherits(Else, _IfCore2);

  function Else(viewFactory, viewSlot) {
    

    var _this4 = _possibleConstructorReturn(this, _IfCore2.call(this, viewFactory, viewSlot));

    _this4._registerInIf();
    return _this4;
  }

  Else.prototype._registerInIf = function _registerInIf() {
    var previous = this.viewSlot.anchor.previousSibling;
    while (previous && !previous.au) {
      previous = previous.previousSibling;
    }
    if (!previous || !previous.au.if) {
      throw new Error("Can't find matching If for Else custom attribute.");
    }
    var ifVm = previous.au.if.viewModel;
    ifVm.else = this;
  };

  return Else;
}(IfCore)) || _class4) || _class4) || _class4);