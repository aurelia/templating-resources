'use strict';

System.register(['aurelia-binding'], function (_export, _context) {
  "use strict";

  var bindingBehavior, _dec, _class, SelfBindingBehavior;

  

  function findOriginalEventTarget(event) {
    return event.path && event.path[0] || event.deepPath && event.deepPath[0] || event.target;
  }

  function handleSelfEvent(event) {
    var target = findOriginalEventTarget(event);
    if (this.target !== target) return;
    this.selfEventCallSource(event);
  }

  return {
    setters: [function (_aureliaBinding) {
      bindingBehavior = _aureliaBinding.bindingBehavior;
    }],
    execute: function () {
      _export('SelfBindingBehavior', SelfBindingBehavior = (_dec = bindingBehavior('self'), _dec(_class = function () {
        function SelfBindingBehavior() {
          
        }

        SelfBindingBehavior.prototype.bind = function bind(binding, source) {
          if (!binding.callSource || !binding.targetEvent) throw new Error('Self binding behavior only supports event.');
          binding.selfEventCallSource = binding.callSource;
          binding.callSource = handleSelfEvent;
        };

        SelfBindingBehavior.prototype.unbind = function unbind(binding, source) {
          binding.callSource = binding.selfEventCallSource;
          binding.selfEventCallSource = null;
        };

        return SelfBindingBehavior;
      }()) || _class));

      _export('SelfBindingBehavior', SelfBindingBehavior);
    }
  };
});