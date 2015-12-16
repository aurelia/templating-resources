System.register(['aurelia-binding'], function (_export) {
  'use strict';

  var bindingMode, EventManager, eventNamesRequired, notApplicableMessage, UpdateTriggerBindingBehavior;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaBinding) {
      bindingMode = _aureliaBinding.bindingMode;
      EventManager = _aureliaBinding.EventManager;
    }],
    execute: function () {
      eventNamesRequired = 'The updateTrigger binding behavior requires at least one event name argument: eg <input value.bind="firstName & updateTrigger:\'blur\'">';
      notApplicableMessage = 'The updateTrigger binding behavior can only be applied to two-way bindings on input/select elements.';

      UpdateTriggerBindingBehavior = (function () {
        _createClass(UpdateTriggerBindingBehavior, null, [{
          key: 'inject',
          value: [EventManager],
          enumerable: true
        }]);

        function UpdateTriggerBindingBehavior(eventManager) {
          _classCallCheck(this, UpdateTriggerBindingBehavior);

          this.eventManager = eventManager;
        }

        UpdateTriggerBindingBehavior.prototype.bind = function bind(binding, source) {
          for (var _len = arguments.length, events = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            events[_key - 2] = arguments[_key];
          }

          if (events.length === 0) {
            throw new Error(eventNamesRequired);
          }
          if (binding.mode !== bindingMode.twoWay) {
            throw new Error(notApplicableMessage);
          }

          var targetObserver = binding.observerLocator.getObserver(binding.target, binding.targetProperty);
          if (!targetObserver.handler) {
            throw new Error(notApplicableMessage);
          }
          binding.targetObserver = targetObserver;

          targetObserver.originalHandler = binding.targetObserver.handler;

          var handler = this.eventManager.createElementHandler(events);
          targetObserver.handler = handler;
        };

        UpdateTriggerBindingBehavior.prototype.unbind = function unbind(binding, source) {
          binding.targetObserver.handler = binding.targetObserver.originalHandler;
          binding.targetObserver.originalHandler = null;
        };

        return UpdateTriggerBindingBehavior;
      })();

      _export('UpdateTriggerBindingBehavior', UpdateTriggerBindingBehavior);
    }
  };
});