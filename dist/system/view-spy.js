System.register(['aurelia-templating', 'aurelia-logging'], function (_export) {
  'use strict';

  var customAttribute, LogManager, ViewSpy;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaTemplating) {
      customAttribute = _aureliaTemplating.customAttribute;
    }, function (_aureliaLogging) {
      LogManager = _aureliaLogging;
    }],
    execute: function () {
      ViewSpy = (function () {
        function ViewSpy() {
          _classCallCheck(this, _ViewSpy);

          this.logger = LogManager.getLogger('view-spy');
        }

        ViewSpy.prototype.log = function log(lifecycleName, context) {
          if (!this.value && lifecycleName === 'created') {
            this.logger.info(lifecycleName, this.view);
          } else if (this.value && this.value.indexOf(lifecycleName) !== -1) {
            this.logger.info(lifecycleName, this.view, context);
          }
        };

        ViewSpy.prototype.created = function created(view) {
          this.view = view;
          this.log('created');
        };

        ViewSpy.prototype.bind = function bind(bindingContext) {
          this.log('bind', bindingContext);
        };

        ViewSpy.prototype.attached = function attached() {
          this.log('attached');
        };

        ViewSpy.prototype.detached = function detached() {
          this.log('detached');
        };

        ViewSpy.prototype.unbind = function unbind() {
          this.log('unbind');
        };

        var _ViewSpy = ViewSpy;
        ViewSpy = customAttribute('view-spy')(ViewSpy) || ViewSpy;
        return ViewSpy;
      })();

      _export('ViewSpy', ViewSpy);
    }
  };
});