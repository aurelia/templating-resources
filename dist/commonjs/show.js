'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;

var _inject = require('aurelia-dependency-injection');

var _customAttribute = require('aurelia-templating');

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

  Show = _inject.inject(Element)(Show) || Show;
  Show = _customAttribute.customAttribute('show')(Show) || Show;
  return Show;
})();

exports.Show = Show;