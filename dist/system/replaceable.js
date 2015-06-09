System.register(['aurelia-dependency-injection', 'aurelia-templating'], function (_export) {
  'use strict';

  var inject, BoundViewFactory, ViewSlot, customAttribute, templateController, Replaceable;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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
      Replaceable = (function () {
        function Replaceable(viewFactory, viewSlot) {
          _classCallCheck(this, _Replaceable);

          viewSlot.add(viewFactory.create());
        }

        var _Replaceable = Replaceable;
        Replaceable = inject(BoundViewFactory, ViewSlot)(Replaceable) || Replaceable;
        Replaceable = templateController(Replaceable) || Replaceable;
        Replaceable = customAttribute('replaceable')(Replaceable) || Replaceable;
        return Replaceable;
      })();

      _export('Replaceable', Replaceable);
    }
  };
});