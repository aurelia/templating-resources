System.register(['aurelia-templating', 'aurelia-dependency-injection'], function (_export) {
  var BoundViewFactory, ViewSlot, customAttribute, templateController, inject, _classCallCheck, _createClass, If;

  return {
    setters: [function (_aureliaTemplating) {
      BoundViewFactory = _aureliaTemplating.BoundViewFactory;
      ViewSlot = _aureliaTemplating.ViewSlot;
      customAttribute = _aureliaTemplating.customAttribute;
      templateController = _aureliaTemplating.templateController;
    }, function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      If = (function () {
        function If(viewFactory, viewSlot) {
          _classCallCheck(this, If);

          this.viewFactory = viewFactory;
          this.viewSlot = viewSlot;
          this.showing = false;
        }

        _createClass(If, [{
          key: 'valueChanged',
          value: function valueChanged(newValue) {
            if (!newValue) {
              if (this.view) {
                this.viewSlot.remove(this.view);
                this.view.unbind();
              }

              this.showing = false;
              return;
            }

            if (!this.view) {
              this.view = this.viewFactory.create();
            }

            if (!this.showing) {
              this.showing = true;

              if (!this.view.bound) {
                this.view.bind();
              }

              this.viewSlot.add(this.view);
            }
          }
        }]);

        _export('If', If = customAttribute('if')(If) || If);

        _export('If', If = templateController(If) || If);

        _export('If', If = inject(BoundViewFactory, ViewSlot)(If) || If);

        return If;
      })();

      _export('If', If);
    }
  };
});