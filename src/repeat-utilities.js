import {
  createOverrideContext,
  BindingBehavior,
  ValueConverter,
  sourceContext,
  bindingMode
} from 'aurelia-binding';

const oneTime = bindingMode.oneTime;

/**
* Update the override context.
* @param startIndex index in collection where to start updating.
*/
export function updateOverrideContexts(views, startIndex) {
  let length = views.length;

  if (startIndex > 0) {
    startIndex = startIndex - 1;
  }

  for (; startIndex < length; ++startIndex) {
    updateOverrideContext(views[startIndex].overrideContext, startIndex, length);
  }
}

/**
  * Creates a complete override context.
  * @param data The item's value.
  * @param index The item's index.
  * @param length The collections total length.
  * @param key The key in a key/value pair.
  */
export function createFullOverrideContext(repeat, data, index, length, key) {
  let bindingContext = {};
  let overrideContext = createOverrideContext(bindingContext, repeat.scope.overrideContext);
  // is key/value pair (Map)
  if (typeof key !== 'undefined') {
    bindingContext[repeat.key] = key;
    bindingContext[repeat.value] = data;
  } else {
    bindingContext[repeat.local] = data;
  }
  updateOverrideContext(overrideContext, index, length);
  return overrideContext;
}

/**
* Updates the override context.
* @param context The context to be updated.
* @param index The context's index.
* @param length The collection's length.
*/
export function updateOverrideContext(overrideContext, index, length) {
  let first = (index === 0);
  let last = (index === length - 1);
  let even = index % 2 === 0;

  overrideContext.$index = index;
  overrideContext.$first = first;
  overrideContext.$last = last;
  overrideContext.$middle = !(first || last);
  overrideContext.$odd = !even;
  overrideContext.$even = even;
}

/**
* Gets a repeat instruction's source expression.
*/
export function getItemsSourceExpression(instruction, attrName) {
  return instruction.behaviorInstructions
    .filter(bi => bi.originalAttrName === attrName)[0]
    .attributes
    .items
    .sourceExpression;
}

/**
* Unwraps an expression to expose the inner, pre-converted / behavior-free expression.
*/
export function unwrapExpression(expression) {
  let unwrapped = false;
  while (expression instanceof BindingBehavior) {
    expression = expression.expression;
  }
  while (expression instanceof ValueConverter) {
    expression = expression.expression;
    unwrapped = true;
  }
  return unwrapped ? expression : null;
}

/**
* Returns whether an expression has the OneTimeBindingBehavior applied.
*/
export function isOneTime(expression) {
  while (expression instanceof BindingBehavior) {
    if (expression.name === 'oneTime') {
      return true;
    }
    expression = expression.expression;
  }
  return false;
}

/**
* Forces a binding instance to reevaluate.
*/
export function updateOneTimeBinding(binding) {
  if (binding.call && binding.mode === oneTime) {
    binding.call(sourceContext);
  } else if (binding.updateOneTimeBindings) {
    binding.updateOneTimeBindings();
  }
}

/**
 * Returns the index of the element in an array, optionally using a matcher function.
 */
export function indexOf(array, item, matcher, startIndex) {
  if (!matcher) {
    // native indexOf is more performant than a for loop
    return array.indexOf(item);
  }
  const length = array.length;
  for (let index = startIndex || 0; index < length; index++) {
    if (matcher(array[index], item)) {
      return index;
    }
  }
  return -1;
}
