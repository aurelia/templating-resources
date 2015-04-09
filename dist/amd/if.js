define(['exports', 'aurelia-templating', 'aurelia-dependency-injection'], function (exports, _aureliaTemplating, _aureliaDependencyInjection) {
  'use strict';

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var If = (function () {
    function If(viewFactory, viewSlot) {
      _classCallCheck(this, If);

      this.viewFactory = viewFactory;
      this.viewSlot = viewSlot;
      this.showing = false;
    }

    _createClass(If, [{
      key: 'valueChanged',
      value: function valueChanged(newValue) {
        if (!newValue) {
          if (this.view) {
            this.viewSlot.remove(this.view);
            this.view.unbind();
          }

          this.showing = false;
          return;
        }

        if (!this.view) {
          this.view = this.viewFactory.create();
        }

        if (!this.showing) {
          this.showing = true;

          if (!this.view.bound) {
            this.view.bind();
          }

          this.viewSlot.add(this.view);
        }
      }
    }]);

    exports.If = If = customAttribute('if')(If) || If;
    exports.If = If = templateController(If) || If;
    exports.If = If = inject(BoundViewFactory, ViewSlot)(If) || If;
    return If;
  })();

  exports.If = If;
});