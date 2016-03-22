
export let AbstractRepeater = class AbstractRepeater {
  constructor(options) {
    Object.assign(this, {
      local: 'items',
      viewsRequireLifecycle: true
    }, options);
  }

  viewCount() {
    throw new Error('subclass must implement `viewCount`');
  }

  views() {
    throw new Error('subclass must implement `views`');
  }

  view(index) {
    throw new Error('subclass must implement `view`');
  }

  addView(bindingContext, overrideContext) {
    throw new Error('subclass must implement `addView`');
  }

  insertView(index, bindingContext, overrideContext) {
    throw new Error('subclass must implement `insertView`');
  }

  removeAllViews(returnToCache, skipAnimation) {
    throw new Error('subclass must implement `removeAllViews`');
  }

  removeView(index, returnToCache, skipAnimation) {
    throw new Error('subclass must implement `removeView`');
  }

  updateBindings(view) {
    throw new Error('subclass must implement `updateBindings`');
  }
};