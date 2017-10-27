define(['exports', 'aurelia-templating', 'aurelia-dependency-injection', './if-core'], function (exports, _aureliaTemplating, _aureliaDependencyInjection, _ifCore) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Else = undefined;

  

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

  var _dec, _dec2, _class;

  var Else = exports.Else = (_dec = (0, _aureliaTemplating.customAttribute)('else'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.ViewSlot), _dec(_class = (0, _aureliaTemplating.templateController)(_class = _dec2(_class = function (_IfCore) {
    _inherits(Else, _IfCore);

    function Else(viewFactory, viewSlot) {
      

      var _this = _possibleConstructorReturn(this, _IfCore.call(this, viewFactory, viewSlot));

      _this._registerInIf();
      return _this;
    }

    Else.prototype.bind = function bind(bindingContext, overrideContext) {
      _IfCore.prototype.bind.call(this, bindingContext, overrideContext);

      if (this.ifVm.condition) {
        this._hide();
      } else {
        this._show();
      }
    };

    Else.prototype._registerInIf = function _registerInIf() {
      var previous = this.viewSlot.anchor.previousSibling;
      while (previous && !previous.au) {
        previous = previous.previousSibling;
      }
      if (!previous || !previous.au.if) {
        throw new Error("Can't find matching If for Else custom attribute.");
      }
      this.ifVm = previous.au.if.viewModel;
      this.ifVm.elseVm = this;
    };

    return Else;
  }(_ifCore.IfCore)) || _class) || _class) || _class);
});