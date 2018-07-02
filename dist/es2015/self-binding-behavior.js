var _dec, _class;

import { bindingBehavior } from 'aurelia-binding';

function findOriginalEventTarget(event) {
  return event.path && event.path[0] || event.deepPath && event.deepPath[0] || event.target;
}

function handleSelfEvent(event) {
  let target = findOriginalEventTarget(event);
  if (this.target !== target) return;
  this.selfEventCallSource(event);
}

export let SelfBindingBehavior = (_dec = bindingBehavior('self'), _dec(_class = class SelfBindingBehavior {
  bind(binding, source) {
    if (!binding.callSource || !binding.targetEvent) throw new Error('Self binding behavior only supports event.');
    binding.selfEventCallSource = binding.callSource;
    binding.callSource = handleSelfEvent;
  }

  unbind(binding, source) {
    binding.callSource = binding.selfEventCallSource;
    binding.selfEventCallSource = null;
  }
}) || _class);