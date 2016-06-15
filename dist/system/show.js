'use strict';

System.register(['aurelia-dependency-injection', 'aurelia-templating', 'aurelia-pal', './aurelia-hide-style'], function (_export, _context) {
  "use strict";

  var inject, Optional, customAttribute, Animator, DOM, injectAureliaHideStyleAtBoundary, aureliaHideClassName, _dec, _dec2, _class, Show;

  

  return {
    setters: [function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
      Optional = _aureliaDependencyInjection.Optional;
    }, function (_aureliaTemplating) {
      customAttribute = _aureliaTemplating.customAttribute;
      Animator = _aureliaTemplating.Animator;
    }, function (_aureliaPal) {
      DOM = _aureliaPal.DOM;
    }, function (_aureliaHideStyle) {
      injectAureliaHideStyleAtBoundary = _aureliaHideStyle.injectAureliaHideStyleAtBoundary;
      aureliaHideClassName = _aureliaHideStyle.aureliaHideClassName;
    }],
    execute: function () {
      _export('Show', Show = (_dec = customAttribute('show'), _dec2 = inject(DOM.Element, Animator, Optional.of(DOM.boundary, true)), _dec(_class = _dec2(_class = function () {
        function Show(element, animator, domBoundary) {
          

          this.element = element;
          this.animator = animator;
          this.domBoundary = domBoundary;
        }

        Show.prototype.created = function created() {
          injectAureliaHideStyleAtBoundary(this.domBoundary);
        };

        Show.prototype.valueChanged = function valueChanged(newValue) {
          if (newValue) {
            this.animator.removeClass(this.element, aureliaHideClassName);
          } else {
            this.animator.addClass(this.element, aureliaHideClassName);
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