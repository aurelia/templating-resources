System.register(['aurelia-templating', 'aurelia-binding', 'aurelia-dependency-injection', 'aurelia-task-queue', 'aurelia-pal'], function (_export) {
  'use strict';

  var customAttribute, bindingMode, inject, TaskQueue, DOM, Focus;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaTemplating) {
      customAttribute = _aureliaTemplating.customAttribute;
    }, function (_aureliaBinding) {
      bindingMode = _aureliaBinding.bindingMode;
    }, function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_aureliaTaskQueue) {
      TaskQueue = _aureliaTaskQueue.TaskQueue;
    }, function (_aureliaPal) {
      DOM = _aureliaPal.DOM;
    }],
    execute: function () {
      Focus = (function () {
        function Focus(element, taskQueue) {
          var _this = this;

          _classCallCheck(this, _Focus);

          this.element = element;
          this.taskQueue = taskQueue;

          this.focusListener = function (e) {
            _this.value = true;
          };
          this.blurListener = function (e) {
            if (DOM.activeElement !== _this.element) {
              _this.value = false;
            }
          };
        }

        Focus.prototype.valueChanged = function valueChanged(newValue) {
          if (newValue) {
            this.giveFocus();
          } else {
            this.element.blur();
          }
        };

        Focus.prototype.giveFocus = function giveFocus() {
          var _this2 = this;

          this.taskQueue.queueMicroTask(function () {
            if (_this2.value) {
              _this2.element.focus();
            }
          });
        };

        Focus.prototype.attached = function attached() {
          this.element.addEventListener('focus', this.focusListener);
          this.element.addEventListener('blur', this.blurListener);
        };

        Focus.prototype.detached = function detached() {
          this.element.removeEventListener('focus', this.focusListener);
          this.element.removeEventListener('blur', this.blurListener);
        };

        var _Focus = Focus;
        Focus = inject(DOM.Element, TaskQueue)(Focus) || Focus;
        Focus = customAttribute('focus', bindingMode.twoWay)(Focus) || Focus;
        return Focus;
      })();

      _export('Focus', Focus);
    }
  };
});