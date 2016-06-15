import {bindingMode, EventManager} from 'aurelia-binding';

const eventNamesRequired = 'The updateTrigger binding behavior requires at least one event name argument: eg <input value.bind="firstName & updateTrigger:\'blur\'">';
const notApplicableMessage = 'The updateTrigger binding behavior can only be applied to two-way bindings on input/select elements.';

export class UpdateTriggerBindingBehavior {
  static inject = [EventManager];

  constructor(eventManager) {
    this.eventManager = eventManager;
  }

  bind(binding, source, ...events) {
    if (events.length === 0) {
      throw new Error(eventNamesRequired);
    }
    if (binding.mode !== bindingMode.twoWay) {
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
    let handler = this.eventManager.createElementHandler(events);
    targetObserver.handler = handler;
  }

  unbind(binding, source) {
    // restore the state of the binding.
    binding.targetObserver.handler = binding.targetObserver.originalHandler;
    binding.targetObserver.originalHandler = null;
  }
}
