System.register(['aurelia-binding'], function (_export) {
  'use strict';

  var createOverrideContext, BindingBehavior, ValueConverter, sourceContext, bindingMode, oneTime;

  _export('updateOverrideContexts', updateOverrideContexts);

  _export('createFullOverrideContext', createFullOverrideContext);

  _export('updateOverrideContext', updateOverrideContext);

  _export('getItemsSourceExpression', getItemsSourceExpression);

  _export('unwrapExpression', unwrapExpression);

  _export('isOneTime', isOneTime);

  _export('updateOneTimeBinding', updateOneTimeBinding);

  function updateOverrideContexts(views, startIndex) {
    var length = views.length;

    if (startIndex > 0) {
      startIndex = startIndex - 1;
    }

    for (; startIndex < length; ++startIndex) {
      updateOverrideContext(views[startIndex].overrideContext, startIndex, length);
    }
  }

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

  function getItemsSourceExpression(instruction, attrName) {
    return instruction.behaviorInstructions.filter(function (bi) {
      return bi.originalAttrName === attrName;
    })[0].attributes.items.sourceExpression;
  }

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

  function isOneTime(expression) {
    while (expression instanceof BindingBehavior) {
      if (expression.name === 'oneTime') {
        return true;
      }
      expression = expression.expression;
    }
    return false;
  }

  function updateOneTimeBinding(binding) {
    if (binding.call && binding.mode === oneTime) {
      binding.call(sourceContext);
    } else if (binding.updateOneTimeBindings) {
      binding.updateOneTimeBindings();
    }
  }

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