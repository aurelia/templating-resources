'use strict';

System.register(['aurelia-dependency-injection', 'aurelia-templating', 'aurelia-pal'], function (_export, _context) {
  var inject, customAttribute, Animator, DOM, _dec, _dec2, _class, Show;

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
      _export('Show', Show = (_dec = customAttribute('show'), _dec2 = inject(DOM.Element, Animator), _dec(_class = _dec2(_class = function () {
        function Show(element, animator) {
          _classCallCheck(this, Show);

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

        return Show;
      }()) || _class) || _class));

      _export('Show', Show);
    }
  };
});