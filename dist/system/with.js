System.register(['aurelia-dependency-injection', 'aurelia-templating', 'aurelia-logging'], function (_export) {
  'use strict';

  var inject, BoundViewFactory, ViewSlot, customAttribute, templateController, LogManager, With;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_aureliaTemplating) {
      BoundViewFactory = _aureliaTemplating.BoundViewFactory;
      ViewSlot = _aureliaTemplating.ViewSlot;
      customAttribute = _aureliaTemplating.customAttribute;
      templateController = _aureliaTemplating.templateController;
    }, function (_aureliaLogging) {
      LogManager = _aureliaLogging;
    }],
    execute: function () {
      With = (function () {
        function With(viewFactory, viewSlot) {
          _classCallCheck(this, _With);

          this.viewFactory = viewFactory;
          this.viewSlot = viewSlot;
          LogManager.getLogger('templating-resources').warn('The "with" behavior will be removed in the next release.');
        }

        With.prototype.valueChanged = function valueChanged(newValue) {
          if (!this.view) {
            this.view = this.viewFactory.create(newValue);
            this.viewSlot.add(this.view);
          } else {
            this.view.bind(newValue);
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