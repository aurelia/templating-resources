'use strict';

System.register(['aurelia-templating', 'aurelia-binding', 'aurelia-dependency-injection', 'aurelia-task-queue', 'aurelia-pal'], function (_export, _context) {
  var customAttribute, bindingMode, inject, TaskQueue, DOM, _dec, _dec2, _class, Focus;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

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
      _export('Focus', Focus = (_dec = customAttribute('focus', bindingMode.twoWay), _dec2 = inject(DOM.Element, TaskQueue), _dec(_class = _dec2(_class = function () {
        function Focus(element, taskQueue) {
          var _this = this;

          _classCallCheck(this, Focus);

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
            this._giveFocus();
          } else {
            this.element.blur();
          }
        };

        Focus.prototype._giveFocus = function _giveFocus() {
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

        return Focus;
      }()) || _class) || _class));

      _export('Focus', Focus);
    }
  };
});