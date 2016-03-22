'use strict';

System.register(['aurelia-dependency-injection', 'aurelia-templating'], function (_export, _context) {
  var inject, BoundViewFactory, ViewSlot, customAttribute, templateController, _dec, _dec2, _class, Replaceable;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_aureliaTemplating) {
      BoundViewFactory = _aureliaTemplating.BoundViewFactory;
      ViewSlot = _aureliaTemplating.ViewSlot;
      customAttribute = _aureliaTemplating.customAttribute;
      templateController = _aureliaTemplating.templateController;
    }],
    execute: function () {
      _export('Replaceable', Replaceable = (_dec = customAttribute('replaceable'), _dec2 = inject(BoundViewFactory, ViewSlot), _dec(_class = templateController(_class = _dec2(_class = function () {
        function Replaceable(viewFactory, viewSlot) {
          _classCallCheck(this, Replaceable);

          this.viewFactory = viewFactory;
          this.viewSlot = viewSlot;
          this.view = null;
        }

        Replaceable.prototype.bind = function bind(bindingContext, overrideContext) {
          if (this.view === null) {
            this.view = this.viewFactory.create();
            this.viewSlot.add(this.view);
          }

          this.view.bind(bindingContext, overrideContext);
        };

        Replaceable.prototype.unbind = function unbind() {
          this.view.unbind();
        };

        return Replaceable;
      }()) || _class) || _class) || _class));

      _export('Replaceable', Replaceable);
    }
  };
});