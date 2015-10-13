define(['exports', 'aurelia-dependency-injection', 'aurelia-templating'], function (exports, _aureliaDependencyInjection, _aureliaTemplating) {
  'use strict';

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var Replaceable = (function () {
    function Replaceable(viewFactory, viewSlot) {
      _classCallCheck(this, _Replaceable);

      this.viewFactory = viewFactory;
      this.viewSlot = viewSlot;
      this.needsReplacement = true;
    }

    Replaceable.prototype.bind = function bind() {
      if (this.needsReplacement) {
        this.needsReplacement = false;
        this.viewSlot.add(this.viewFactory.create());
      }
    };

    var _Replaceable = Replaceable;
    Replaceable = _aureliaDependencyInjection.inject(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.ViewSlot)(Replaceable) || Replaceable;
    Replaceable = _aureliaTemplating.templateController(Replaceable) || Replaceable;
    Replaceable = _aureliaTemplating.customAttribute('replaceable')(Replaceable) || Replaceable;
    return Replaceable;
  })();

  exports.Replaceable = Replaceable;
});