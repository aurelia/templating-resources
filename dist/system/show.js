System.register(['aurelia-dependency-injection', 'aurelia-templating'], function (_export) {
  'use strict';

  var inject, customAttribute, injectStyles, hasShadowDOM, Show;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_aureliaTemplating) {
      customAttribute = _aureliaTemplating.customAttribute;
      injectStyles = _aureliaTemplating.injectStyles;
      hasShadowDOM = _aureliaTemplating.hasShadowDOM;
    }],
    execute: function () {

      if (hasShadowDOM) {
        injectStyles('body /deep/ .aurelia-hide { display:none !important; }');
      } else {
        injectStyles('.aurelia-hide { display:none !important; }');
      }

      Show = (function () {
        function Show(element) {
          _classCallCheck(this, _Show);

          this.element = element;
        }

        Show.prototype.valueChanged = function valueChanged(newValue) {
          if (newValue) {
            this.element.classList.remove('aurelia-hide');
          } else {
            this.element.classList.add('aurelia-hide');
          }
        };

        Show.prototype.bind = function bind(bindingContext) {
          this.valueChanged(this.value);
        };

        var _Show = Show;
        Show = inject(Element)(Show) || Show;
        Show = customAttribute('show')(Show) || Show;
        return Show;
      })();

      _export('Show', Show);
    }
  };
});