/**
* Behaviors that do not require the composition lifecycle callbacks when replacing
* their binding context.
*/
export const lifecycleOptionalBehaviors = ['focus', 'if', 'else', 'repeat', 'show', 'hide', 'with'];

function behaviorRequiresLifecycle(instruction) {
  let t = instruction.type;
  let name = t.elementName !== null ? t.elementName : t.attributeName;
  return lifecycleOptionalBehaviors.indexOf(name) === -1 && (t.handlesAttached || t.handlesBind || t.handlesCreated || t.handlesDetached || t.handlesUnbind)
    || t.viewFactory && viewsRequireLifecycle(t.viewFactory)
    || instruction.viewFactory && viewsRequireLifecycle(instruction.viewFactory);
}

function targetRequiresLifecycle(instruction) {
  // check each behavior instruction.
  let behaviors = instruction.behaviorInstructions;
  if (behaviors) {
    let i = behaviors.length;
    while (i--) {
      if (behaviorRequiresLifecycle(behaviors[i])) {
        return true;
      }
    }
  }

  // check the instruction's view factory (if it has one).
  return instruction.viewFactory && viewsRequireLifecycle(instruction.viewFactory);
}

export function viewsRequireLifecycle(viewFactory) {
  // already analyzed?
  if ('_viewsRequireLifecycle' in viewFactory) {
    return viewFactory._viewsRequireLifecycle;
  }

  // set prop to avoid infinite recursion.
  viewFactory._viewsRequireLifecycle = false;

  // access inner view factory.
  if (viewFactory.viewFactory) {
    viewFactory._viewsRequireLifecycle = viewsRequireLifecycle(viewFactory.viewFactory);
    return viewFactory._viewsRequireLifecycle;
  }

  // template uses animation?
  if (viewFactory.template.querySelector('.au-animate')) {
    viewFactory._viewsRequireLifecycle = true;
    return true;
  }

  // target instructions require lifecycle?
  for (let id in viewFactory.instructions) {
    if (targetRequiresLifecycle(viewFactory.instructions[id])) {
      viewFactory._viewsRequireLifecycle = true;
      return true;
    }
  }

  // safe to skip lifecycle.
  viewFactory._viewsRequireLifecycle = false;
  return false;
}
