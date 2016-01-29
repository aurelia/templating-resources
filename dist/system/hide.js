System.register(['aurelia-dependency-injection', 'aurelia-templating', 'aurelia-pal'], function (_export) {
  'use strict';

  var inject, customAttribute, Animator, DOM, Hide;

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
      Hide = (function () {
        function Hide(element, animator) {
          _classCallCheck(this, _Hide);

          this.element = element;
          this.animator = animator;
        }

        Hide.prototype.valueChanged = function valueChanged(newValue) {
          if (newValue) {
            this.animator.addClass(this.element, 'aurelia-hide');
          } else {
            this.animator.removeClass(this.element, 'aurelia-hide');
          }
        };

        Hide.prototype.bind = function bind(bindingContext) {
          this.valueChanged(this.value);
        };

        var _Hide = Hide;
        Hide = inject(DOM.Element, Animator)(Hide) || Hide;
        Hide = customAttribute('hide')(Hide) || Hide;
        return Hide;
      })();

      _export('Hide', Hide);
    }
  };
});