/**
* An abstract base class for elements and attributes that repeat
* views.
*/
export class AbstractRepeater {
  constructor(options) {
    Object.assign(this, {
      local: 'items',
      viewsRequireLifecycle: true
    }, options);
  }

  /**
   * Returns the number of views the repeater knows about.
   *
   * @return {Number}  the number of views.
   */
  viewCount() {
    throw new Error('subclass must implement `viewCount`');
  }

  /**
   * Returns all of the repeaters views as an array.
   *
   * @return {Array} The repeater's array of views;
   */
  views() {
    throw new Error('subclass must implement `views`');
  }

  /**
   * Returns a single view from the repeater at the provided index.
   *
   * @param {Number} index The index of the requested view.
   * @return {View|ViewSlot} The requested view.
   */
  view(index) {
    throw new Error('subclass must implement `view`');
  }

  /**
   * Returns the matcher function to be used by the repeater, or null if strict matching is to be performed.
   *
   * @return {Function|null} The requested matcher function.
   */
  matcher() {
    throw new Error('subclass must implement `matcher`');
  }

  /**
   * Adds a view to the repeater, binding the view to the
   * provided contexts.
   *
   * @param {Object} bindingContext The binding context to bind the new view to.
   * @param {Object} overrideContext A secondary binding context that can override the primary context.
   */
  addView(bindingContext, overrideContext) {
    throw new Error('subclass must implement `addView`');
  }

  /**
   * Inserts a view to the repeater at a specific index, binding the view to the
   * provided contexts.
   *
   * @param {Number} index The index at which to create the new view at.
   * @param {Object} bindingContext The binding context to bind the new view to.
   * @param {Object} overrideContext A secondary binding context that can override the primary context.
   */
  insertView(index, bindingContext, overrideContext) {
    throw new Error('subclass must implement `insertView`');
  }

  /**
   * Moves a view across the repeater.
   *
   * @param {Number} sourceIndex The index of the view to be moved.
   * @param {Number} sourceIndex The index where the view should be placed at.
   */
  moveView(sourceIndex, targetIndex) {
    throw new Error('subclass must implement `moveView`');
  }

  /**
   * Removes all views from the repeater.
   * @param {Boolean} returnToCache Should the view be returned to the view cache?
   * @param {Boolean} skipAnimation Should the removal animation be skipped?
   * @return {Promise|null}
   */
  removeAllViews(returnToCache?: boolean, skipAnimation?: boolean) {
    throw new Error('subclass must implement `removeAllViews`');
  }

  /**
   * Removes an array of Views from the repeater.
   *
   * @param {Array} viewsToRemove The array of views to be removed.
   * @param {Boolean} returnToCache Should the view be returned to the view cache?
   * @param {Boolean} skipAnimation Should the removal animation be skipped?
   * @return {Promise|null}
   */
  removeViews(viewsToRemove: Array<View>, returnToCache?: boolean, skipAnimation?: boolean) {
    throw new Error('subclass must implement `removeView`');
  }

  /**
   * Removes a view from the repeater at a specific index.
   *
   * @param {Number} index The index of the view to be removed.
   * @param {Boolean} returnToCache Should the view be returned to the view cache?
   * @param {Boolean} skipAnimation Should the removal animation be skipped?
   * @return {Promise|null}
   */
  removeView(index: number, returnToCache?: boolean, skipAnimation?: boolean) {
    throw new Error('subclass must implement `removeView`');
  }

  /**
   * Forces a particular view to update it's bindings, called as part of
   * an in-place processing of items for better performance
   *
   * @param {Object} view the target view for bindings updates
   */
  updateBindings(view: View) {
    throw new Error('subclass must implement `updateBindings`');
  }
}
