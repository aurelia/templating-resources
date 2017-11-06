function evaluate(binding, source) {
  return binding.sourceExpression.evaluate(source, binding.lookupFunctions);
}

export class DirtyBindingBehavior {

  timer;
  updateTarget;
  
  bind(binding, source, frequency = 100) {  

    // intercept the updateTarget function, reference it locally, and unset it
    // on the binding since we will handle all of the updates
    this.updateTarget = binding.updateTarget;
    let updateTarget = binding.updateTarget.bind(binding);
    binding.updateTarget = () => {};

    // track the current value and call updateTarget with the current value
    let oldValue = evaluate(binding, source);
    updateTarget(oldValue);

    this.timer = setInterval(() => {

      // get the new current value
      let newValue = evaluate(binding, source);

      // if the value has changed, call updateTarget with the new value and 
      // store the new value as the current value
      if (newValue !== oldValue) {
        updateTarget(newValue);
        oldValue = newValue;
      }
    }, frequency);
  }
 
  unbind(binding, source) {
    clearInterval(this.timer);
    binding.updateTarget = this.updateTarget;
  }
}

