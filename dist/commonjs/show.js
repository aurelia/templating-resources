'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaTemplating = require('aurelia-templating');

function addStyleString(str) {
  var node = document.createElement('style');
  node.innerHTML = str;
  node.type = 'text/css';
  document.head.appendChild(node);
}

addStyleString('.aurelia-hide { display:none !important; }');

var Show = (function () {
  function Show(element) {
    _classCallCheck(this, _Show);

    this.element = element;
  }

  var _Show = Show;

  _Show.prototype.valueChanged = function valueChanged(newValue) {
    if (newValue) {
      this.element.classList.remove('aurelia-hide');
    } else {
      this.element.classList.add('aurelia-hide');
    }
  };

  Show = (0, _aureliaDependencyInjection.inject)(Element)(Show) || Show;
  Show = (0, _aureliaTemplating.customAttribute)('show')(Show) || Show;
  return Show;
})();

exports.Show = Show;