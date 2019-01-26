'use strict';

System.register(['aurelia-templating', 'aurelia-dependency-injection', './if-core'], function (_export, _context) {
  "use strict";

  var BoundViewFactory, ViewSlot, bindable, customAttribute, templateController, inject, IfCore, _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, If;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
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

  return {
    setters: [function (_aureliaTemplating) {
      BoundViewFactory = _aureliaTemplating.BoundViewFactory;
      ViewSlot = _aureliaTemplating.ViewSlot;
      bindable = _aureliaTemplating.bindable;
      customAttribute = _aureliaTemplating.customAttribute;
      templateController = _aureliaTemplating.templateController;
    }, function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_ifCore) {
      IfCore = _ifCore.IfCore;
    }],
    execute: function () {
      _export('If', If = (_dec = customAttribute('if'), _dec2 = inject(BoundViewFactory, ViewSlot), _dec3 = bindable({ primaryProperty: true }), _dec(_class = templateController(_class = _dec2(_class = (_class2 = function (_IfCore) {
        _inherits(If, _IfCore);

        function If() {
          var _temp, _this, _ret;

          

          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return _ret = (_temp = (_this = _possibleConstructorReturn(this, _IfCore.call.apply(_IfCore, [this].concat(args))), _this), _initDefineProp(_this, 'condition', _descriptor, _this), _initDefineProp(_this, 'swapOrder', _descriptor2, _this), _initDefineProp(_this, 'cache', _descriptor3, _this), _temp), _possibleConstructorReturn(_this, _ret);
        }

        If.prototype.bind = function bind(bindingContext, overrideContext) {
          _IfCore.prototype.bind.call(this, bindingContext, overrideContext);
          if (this.condition) {
            this._show();
          } else {
            this._hide();
          }
        };

        If.prototype.conditionChanged = function conditionChanged(newValue) {
          this._update(newValue);
        };

        If.prototype._update = function _update(show) {
          var _this2 = this;

          if (this.animating) {
            return;
          }

          var promise = void 0;
          if (this.elseVm) {
            promise = show ? this._swap(this.elseVm, this) : this._swap(this, this.elseVm);
          } else {
            promise = show ? this._show() : this._hide();
          }

          if (promise) {
            this.animating = true;
            promise.then(function () {
              _this2.animating = false;
              if (_this2.condition !== _this2.showing) {
                _this2._update(_this2.condition);
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
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'cache', [bindable], {
        enumerable: true,
        initializer: function initializer() {
          return true;
        }
      })), _class2)) || _class) || _class) || _class));

      _export('If', If);
    }
  };
});