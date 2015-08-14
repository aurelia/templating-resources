System.register(['aurelia-templating', 'aurelia-dependency-injection', 'aurelia-task-queue'], function (_export) {
  'use strict';

  var BoundViewFactory, ViewSlot, customAttribute, templateController, inject, TaskQueue, If;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaTemplating) {
      BoundViewFactory = _aureliaTemplating.BoundViewFactory;
      ViewSlot = _aureliaTemplating.ViewSlot;
      customAttribute = _aureliaTemplating.customAttribute;
      templateController = _aureliaTemplating.templateController;
    }, function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_aureliaTaskQueue) {
      TaskQueue = _aureliaTaskQueue.TaskQueue;
    }],
    execute: function () {
      If = (function () {
        function If(viewFactory, viewSlot, taskQueue) {
          _classCallCheck(this, _If);

          this.viewFactory = viewFactory;
          this.viewSlot = viewSlot;
          this.showing = false;
          this.taskQueue = taskQueue;
        }

        If.prototype.bind = function bind(executionContext) {
          this.$parent = executionContext;
          this.valueChanged(this.value);
        };

        If.prototype.valueChanged = function valueChanged(newValue) {
          var _this = this;

          if (!newValue) {
            if (this.view && this.showing) {
              this.taskQueue.queueMicroTask(function () {
                _this.viewSlot.remove(_this.view);
                _this.view.unbind();
              });
            }

            this.showing = false;
            return;
          }

          if (!this.view) {
            this.view = this.viewFactory.create(this.$parent);
          }

          if (!this.showing) {
            this.showing = true;

            if (!this.view.isBound) {
              this.view.bind();
            }

            this.viewSlot.add(this.view);
          }
        };

        var _If = If;
        If = inject(BoundViewFactory, ViewSlot, TaskQueue)(If) || If;
        If = templateController(If) || If;
        If = customAttribute('if')(If) || If;
        return If;
      })();

      _export('If', If);
    }
  };
});