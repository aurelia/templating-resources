System.register(['aurelia-dependency-injection', 'aurelia-templating'], function (_export) {
  var inject, customAttribute, _classCallCheck, _createClass, Show;

  function addStyleString(str) {
    var node = document.createElement('style');
    node.innerHTML = str;
    node.type = 'text/css';
    document.head.appendChild(node);
  }

  return {
    setters: [function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_aureliaTemplating) {
      customAttribute = _aureliaTemplating.customAttribute;
    }],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      addStyleString('.aurelia-hide { display:none !important; }');

      Show = (function () {
        function Show(element) {
          _classCallCheck(this, Show);

          this.element = element;
        }

        _createClass(Show, [{
          key: 'valueChanged',
          value: function valueChanged(newValue) {
            if (newValue) {
              this.element.classList.remove('aurelia-hide');
            } else {
              this.element.classList.add('aurelia-hide');
            }
          }
        }]);

        _export('Show', Show = customAttribute('show')(Show) || Show);

        _export('Show', Show = inject(Element)(Show) || Show);

        return Show;
      })();

      _export('Show', Show);
    }
  };
});