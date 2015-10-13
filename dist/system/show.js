System.register(['aurelia-dependency-injection', 'aurelia-templating', 'aurelia-pal'], function (_export) {
  'use strict';

  var inject, customAttribute, Animator, DOM, Show;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_aureliaTemplating) {
      customAttribute = _aureliaTemplating.customAttribute;
      Animator = _aureliaTemplating.Animator;
    }, function (_aureliaPal) {
      DOM = _aureliaPal.DOM;
    }],
    execute: function () {
      Show = (function () {
        function Show(element, animator) {
          _classCallCheck(this, _Show);

          this.element = element;
          this.animator = animator;
        }

        Show.prototype.valueChanged = function valueChanged(newValue) {
          if (newValue) {
            this.animator.removeClass(this.element, 'aurelia-hide');
          } else {
            this.animator.addClass(this.element, 'aurelia-hide');
          }
        };

        Show.prototype.bind = function bind(bindingContext) {
          this.valueChanged(this.value);
        };

        var _Show = Show;
        Show = inject(DOM.Element, Animator)(Show) || Show;
        Show = customAttribute('show')(Show) || Show;
        return Show;
      })();

      _export('Show', Show);
    }
  };
});