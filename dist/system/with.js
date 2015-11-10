System.register(['aurelia-dependency-injection', 'aurelia-templating', 'aurelia-binding'], function (_export) {
  'use strict';

  var inject, BoundViewFactory, ViewSlot, customAttribute, templateController, createOverrideContext, With;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_aureliaTemplating) {
      BoundViewFactory = _aureliaTemplating.BoundViewFactory;
      ViewSlot = _aureliaTemplating.ViewSlot;
      customAttribute = _aureliaTemplating.customAttribute;
      templateController = _aureliaTemplating.templateController;
    }, function (_aureliaBinding) {
      createOverrideContext = _aureliaBinding.createOverrideContext;
    }],
    execute: function () {
      With = (function () {
        function With(viewFactory, viewSlot) {
          _classCallCheck(this, _With);

          this.viewFactory = viewFactory;
          this.viewSlot = viewSlot;
          this.parentOverrideContext = null;
          this.view = null;
        }

        With.prototype.bind = function bind(bindingContext, overrideContext) {
          this.parentOverrideContext = overrideContext;
          this.valueChanged(this.value);
        };

        With.prototype.valueChanged = function valueChanged(newValue) {
          var overrideContext = createOverrideContext(newValue, this.parentOverrideContext);
          if (!this.view) {
            this.view = this.viewFactory.create();
            this.view.bind(newValue, overrideContext);
            this.viewSlot.add(this.view);
          } else {
            this.view.bind(newValue, overrideContext);
          }
        };

        With.prototype.unbind = function unbind() {
          this.parentOverrideContext = null;

          if (this.view) {
            this.view.unbind();
          }
        };

        var _With = With;
        With = inject(BoundViewFactory, ViewSlot)(With) || With;
        With = templateController(With) || With;
        With = customAttribute('with')(With) || With;
        return With;
      })();

      _export('With', With);
    }
  };
});