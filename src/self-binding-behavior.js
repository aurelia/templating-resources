function findOriginalEventTarget(event) {
  return (event.path && event.path[0]) || (event.deepPath && event.deepPath[0]) || event.target;
}

function handleSelfEvent(event) {
  let target = findOriginalEventTarget(event);
  if (this.target !== target) return;
  this.originalCallSource(event);
}

export class SelfBindingBehavior {
  bind(binding, source) {
    if (!binding.callSource || !binding.targetEvent) throw new Error('Self binding behavior only supports event.');
    binding.originalCallSource = binding.callSource;
    binding.callSource = handleSelfEvent;
  }

  unbind(binding, source) {
    this.callSource = this.originalCallSource;
    this.originalCallSource = null;
  }
}
