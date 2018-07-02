'use strict';

System.register(['aurelia-dependency-injection', 'aurelia-templating', 'aurelia-pal', './aurelia-hide-style'], function (_export, _context) {
  "use strict";

  var Optional, customAttribute, Animator, DOM, injectAureliaHideStyleAtBoundary, aureliaHideClassName, _dec, _class, Hide;

  

  return {
    setters: [function (_aureliaDependencyInjection) {
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
      _export('Hide', Hide = (_dec = customAttribute('hide'), _dec(_class = function () {
        Hide.inject = function inject() {
          return [DOM.Element, Animator, Optional.of(DOM.boundary, true)];
        };

        function Hide(element, animator, domBoundary) {
          

          this.element = element;
          this.animator = animator;
          this.domBoundary = domBoundary;
        }

        Hide.prototype.created = function created() {
          injectAureliaHideStyleAtBoundary(this.domBoundary);
        };

        Hide.prototype.valueChanged = function valueChanged(newValue) {
          if (newValue) {
            this.animator.addClass(this.element, aureliaHideClassName);
          } else {
            this.animator.removeClass(this.element, aureliaHideClassName);
          }
        };

        Hide.prototype.bind = function bind(bindingContext) {
          this.valueChanged(this.value);
        };

        return Hide;
      }()) || _class));

      _export('Hide', Hide);
    }
  };
});