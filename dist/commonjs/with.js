'use strict';

exports.__esModule = true;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaTemplating = require('aurelia-templating');

var _aureliaLogging = require('aurelia-logging');

var LogManager = _interopRequireWildcard(_aureliaLogging);

var With = (function () {
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
  With = _aureliaDependencyInjection.inject(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.ViewSlot)(With) || With;
  With = _aureliaTemplating.templateController(With) || With;
  With = _aureliaTemplating.customAttribute('with')(With) || With;
  return With;
})();

exports.With = With;