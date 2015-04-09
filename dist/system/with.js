System.register(['aurelia-dependency-injection', 'aurelia-templating'], function (_export) {
  var inject, BoundViewFactory, ViewSlot, customAttribute, templateController, _classCallCheck, _createClass, With;

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
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      With = (function () {
        function With(viewFactory, viewSlot) {
          _classCallCheck(this, With);

          this.viewFactory = viewFactory;
          this.viewSlot = viewSlot;
        }

        _createClass(With, [{
          key: 'valueChanged',
          value: function valueChanged(newValue) {
            if (!this.view) {
              this.view = this.viewFactory.create(newValue);
              this.viewSlot.add(this.view);
            } else {
              this.view.bind(newValue);
            }
          }
        }]);

        _export('With', With = customAttribute('with')(With) || With);

        _export('With', With = templateController(With) || With);

        _export('With', With = inject(BoundViewFactory, ViewSlot)(With) || With);

        return With;
      })();

      _export('With', With);
    }
  };
});