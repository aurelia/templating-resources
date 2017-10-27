'use strict';

System.register(['aurelia-templating', 'aurelia-dependency-injection', './if-core'], function (_export, _context) {
  "use strict";

  var BoundViewFactory, ViewSlot, customAttribute, templateController, inject, IfCore, _dec, _dec2, _class, Else;

  

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

  return {
    setters: [function (_aureliaTemplating) {
      BoundViewFactory = _aureliaTemplating.BoundViewFactory;
      ViewSlot = _aureliaTemplating.ViewSlot;
      customAttribute = _aureliaTemplating.customAttribute;
      templateController = _aureliaTemplating.templateController;
    }, function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_ifCore) {
      IfCore = _ifCore.IfCore;
    }],
    execute: function () {
      _export('Else', Else = (_dec = customAttribute('else'), _dec2 = inject(BoundViewFactory, ViewSlot), _dec(_class = templateController(_class = _dec2(_class = function (_IfCore) {
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
      }(IfCore)) || _class) || _class) || _class));

      _export('Else', Else);
    }
  };
});