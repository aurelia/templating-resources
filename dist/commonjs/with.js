'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;

var _inject = require('aurelia-dependency-injection');

var _BoundViewFactory$ViewSlot$customAttribute$templateController = require('aurelia-templating');

var With = (function () {
  function With(viewFactory, viewSlot) {
    _classCallCheck(this, _With);

    this.viewFactory = viewFactory;
    this.viewSlot = viewSlot;
  }

  var _With = With;

  _With.prototype.valueChanged = function valueChanged(newValue) {
    if (!this.view) {
      this.view = this.viewFactory.create(newValue);
      this.viewSlot.add(this.view);
    } else {
      this.view.bind(newValue);
    }
  };

  With = _inject.inject(_BoundViewFactory$ViewSlot$customAttribute$templateController.BoundViewFactory, _BoundViewFactory$ViewSlot$customAttribute$templateController.ViewSlot)(With) || With;
  With = _BoundViewFactory$ViewSlot$customAttribute$templateController.templateController(With) || With;
  With = _BoundViewFactory$ViewSlot$customAttribute$templateController.customAttribute('with')(With) || With;
  return With;
})();

exports.With = With;