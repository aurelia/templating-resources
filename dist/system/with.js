'use strict';

System.register(['aurelia-dependency-injection', 'aurelia-templating', 'aurelia-binding'], function (_export, _context) {
  "use strict";

  var inject, BoundViewFactory, ViewSlot, customAttribute, templateController, createOverrideContext, _dec, _dec2, _class, With;

  

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
      _export('With', With = (_dec = customAttribute('with'), _dec2 = inject(BoundViewFactory, ViewSlot), _dec(_class = templateController(_class = _dec2(_class = function () {
        function With(viewFactory, viewSlot) {
          

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

        return With;
      }()) || _class) || _class) || _class));

      _export('With', With);
    }
  };
});