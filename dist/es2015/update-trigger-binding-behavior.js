var _class, _temp;

import { bindingMode, EventManager } from 'aurelia-binding';

const eventNamesRequired = 'The updateTrigger binding behavior requires at least one event name argument: eg <input value.bind="firstName & updateTrigger:\'blur\'">';
const notApplicableMessage = 'The updateTrigger binding behavior can only be applied to two-way bindings on input/select elements.';

export let UpdateTriggerBindingBehavior = (_temp = _class = class UpdateTriggerBindingBehavior {

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

    let targetObserver = binding.observerLocator.getObserver(binding.target, binding.targetProperty);
    if (!targetObserver.handler) {
      throw new Error(notApplicableMessage);
    }
    binding.targetObserver = targetObserver;

    targetObserver.originalHandler = binding.targetObserver.handler;

    let handler = this.eventManager.createElementHandler(events);
    targetObserver.handler = handler;
  }

  unbind(binding, source) {
    binding.targetObserver.handler = binding.targetObserver.originalHandler;
    binding.targetObserver.originalHandler = null;
  }
}, _class.inject = [EventManager], _temp);