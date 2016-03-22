'use strict';

System.register(['aurelia-dependency-injection', 'aurelia-templating', 'aurelia-pal'], function (_export, _context) {
  var inject, customAttribute, Animator, DOM, _dec, _dec2, _class, Hide;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

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
      _export('Hide', Hide = (_dec = customAttribute('hide'), _dec2 = inject(DOM.Element, Animator), _dec(_class = _dec2(_class = function () {
        function Hide(element, animator) {
          _classCallCheck(this, Hide);

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

        return Hide;
      }()) || _class) || _class));

      _export('Hide', Hide);
    }
  };
});