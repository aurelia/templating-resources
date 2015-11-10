import {bindingMode, EventManager} from 'aurelia-binding';

const eventNamesRequired = `The updateTrigger binding behavior requires at least one event name argument: eg <input value.bind="firstName & updateTrigger:'blur'">`;
const notApplicableMessage = `The updateTrigger binding behavior can only be applied to two-way bindings on input/select elements.`;

export class UpdateTriggerBindingBehavior {
  static inject = [EventManager];

  constructor(eventManager) {
    this.eventManager = eventManager;
  }

  bind(binding, source, ...events) {
    if (events.length === 0) {
      throw new Error(eventNamesRequired);
    }
    if (binding.mode !== bindingMode.twoWay || !binding.targetProperty.handler) {
      throw new Error(notApplicableMessage);
    }

    // stash the original element subscribe function.
    binding.targetProperty.originalHandler = binding.targetProperty.handler;

    // replace the element subscribe function with one that uses the correct events.
    let handler = this.eventManager.createElementHandler(events);
    binding.targetProperty.handler = handler;
  }

  unbind(binding, source) {
    // restore the state of the binding.
    binding.targetProperty.handler = binding.targetProperty.originalHandler;
    binding.targetProperty.originalHandler = null;
  }
}
