import { bindingMode, EventSubscriber, bindingBehavior } from 'aurelia-binding';

// tslint:disable-next-line:max-line-length
const eventNamesRequired = 'The updateTrigger binding behavior requires at least one event name argument: eg <input value.bind="firstName & updateTrigger:\'blur\'">';
const notApplicableMessage = 'The updateTrigger binding behavior can only be applied to two-way/ from-view bindings on input/select elements.';

@bindingBehavior('updateTrigger')
export class UpdateTriggerBindingBehavior {

  bind(binding, source, ...events) {
    if (events.length === 0) {
      throw new Error(eventNamesRequired);
    }
    if (binding.mode !== bindingMode.twoWay && binding.mode !== bindingMode.fromView) {
      throw new Error(notApplicableMessage);
    }

    // ensure the binding's target observer has been set.
    let targetObserver = binding.observerLocator.getObserver(binding.target, binding.targetProperty);
    if (!targetObserver.handler) {
      throw new Error(notApplicableMessage);
    }
    binding.targetObserver = targetObserver;

    // stash the original element subscribe function.
    targetObserver.originalHandler = binding.targetObserver.handler;

    // replace the element subscribe function with one that uses the correct events.
    let handler = new EventSubscriber(events);
    targetObserver.handler = handler;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unbind(binding, source) {
    let targetObserver = binding.targetObserver;
    // restore the state of the binding.
    targetObserver.handler.dispose();
    targetObserver.handler = targetObserver.originalHandler;
    targetObserver.originalHandler = null;
  }
}
