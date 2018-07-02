'use strict';

System.register(['aurelia-templating', 'aurelia-binding', 'aurelia-task-queue', 'aurelia-pal'], function (_export, _context) {
  "use strict";

  var customAttribute, bindingMode, TaskQueue, DOM, _dec, _class, Focus;

  

  return {
    setters: [function (_aureliaTemplating) {
      customAttribute = _aureliaTemplating.customAttribute;
    }, function (_aureliaBinding) {
      bindingMode = _aureliaBinding.bindingMode;
    }, function (_aureliaTaskQueue) {
      TaskQueue = _aureliaTaskQueue.TaskQueue;
    }, function (_aureliaPal) {
      DOM = _aureliaPal.DOM;
    }],
    execute: function () {
      _export('Focus', Focus = (_dec = customAttribute('focus', bindingMode.twoWay), _dec(_class = function () {
        Focus.inject = function inject() {
          return [DOM.Element, TaskQueue];
        };

        function Focus(element, taskQueue) {
          

          this.element = element;
          this.taskQueue = taskQueue;
          this.isAttached = false;
          this.needsApply = false;
        }

        Focus.prototype.valueChanged = function valueChanged(newValue) {
          if (this.isAttached) {
            this._apply();
          } else {
            this.needsApply = true;
          }
        };

        Focus.prototype._apply = function _apply() {
          var _this = this;

          if (this.value) {
            this.taskQueue.queueMicroTask(function () {
              if (_this.value) {
                _this.element.focus();
              }
            });
          } else {
            this.element.blur();
          }
        };

        Focus.prototype.attached = function attached() {
          this.isAttached = true;
          if (this.needsApply) {
            this.needsApply = false;
            this._apply();
          }
          this.element.addEventListener('focus', this);
          this.element.addEventListener('blur', this);
        };

        Focus.prototype.detached = function detached() {
          this.isAttached = false;
          this.element.removeEventListener('focus', this);
          this.element.removeEventListener('blur', this);
        };

        Focus.prototype.handleEvent = function handleEvent(e) {
          if (e.type === 'focus') {
            this.value = true;
          } else if (DOM.activeElement !== this.element) {
            this.value = false;
          }
        };

        return Focus;
      }()) || _class));

      _export('Focus', Focus);
    }
  };
});