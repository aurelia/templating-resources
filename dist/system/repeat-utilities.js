'use strict';

System.register(['aurelia-binding'], function (_export, _context) {
  "use strict";

  var createOverrideContext, BindingBehavior, ValueConverter, sourceContext, bindingMode, oneTime;
  function updateOverrideContexts(views, startIndex) {
    var length = views.length;

    if (startIndex > 0) {
      startIndex = startIndex - 1;
    }

    for (; startIndex < length; ++startIndex) {
      updateOverrideContext(views[startIndex].overrideContext, startIndex, length);
    }
  }

  _export('updateOverrideContexts', updateOverrideContexts);

  function createFullOverrideContext(repeat, data, index, length, key) {
    var bindingContext = {};
    var overrideContext = createOverrideContext(bindingContext, repeat.scope.overrideContext);

    if (typeof key !== 'undefined') {
      bindingContext[repeat.key] = key;
      bindingContext[repeat.value] = data;
    } else {
      bindingContext[repeat.local] = data;
    }
    updateOverrideContext(overrideContext, index, length);
    return overrideContext;
  }

  _export('createFullOverrideContext', createFullOverrideContext);

  function updateOverrideContext(overrideContext, index, length) {
    var first = index === 0;
    var last = index === length - 1;
    var even = index % 2 === 0;

    overrideContext.$index = index;
    overrideContext.$first = first;
    overrideContext.$last = last;
    overrideContext.$middle = !(first || last);
    overrideContext.$odd = !even;
    overrideContext.$even = even;
  }

  _export('updateOverrideContext', updateOverrideContext);

  function getItemsSourceExpression(instruction, attrName) {
    return instruction.behaviorInstructions.filter(function (bi) {
      return bi.originalAttrName === attrName;
    })[0].attributes.items.sourceExpression;
  }

  _export('getItemsSourceExpression', getItemsSourceExpression);

  function unwrapExpression(expression) {
    var unwrapped = false;
    while (expression instanceof BindingBehavior) {
      expression = expression.expression;
    }
    while (expression instanceof ValueConverter) {
      expression = expression.expression;
      unwrapped = true;
    }
    return unwrapped ? expression : null;
  }

  _export('unwrapExpression', unwrapExpression);

  function isOneTime(expression) {
    while (expression instanceof BindingBehavior) {
      if (expression.name === 'oneTime') {
        return true;
      }
      expression = expression.expression;
    }
    return false;
  }

  _export('isOneTime', isOneTime);

  function updateOneTimeBinding(binding) {
    if (binding.call && binding.mode === oneTime) {
      binding.call(sourceContext);
    } else if (binding.updateOneTimeBindings) {
      binding.updateOneTimeBindings();
    }
  }

  _export('updateOneTimeBinding', updateOneTimeBinding);

  function indexOf(array, item, matcher, startIndex) {
    if (!matcher) {
      return array.indexOf(item);
    }
    var length = array.length;
    for (var index = startIndex || 0; index < length; index++) {
      if (matcher(array[index], item)) {
        return index;
      }
    }
    return -1;
  }

  _export('indexOf', indexOf);

  return {
    setters: [function (_aureliaBinding) {
      createOverrideContext = _aureliaBinding.createOverrideContext;
      BindingBehavior = _aureliaBinding.BindingBehavior;
      ValueConverter = _aureliaBinding.ValueConverter;
      sourceContext = _aureliaBinding.sourceContext;
      bindingMode = _aureliaBinding.bindingMode;
    }],
    execute: function () {
      oneTime = bindingMode.oneTime;
    }
  };
});