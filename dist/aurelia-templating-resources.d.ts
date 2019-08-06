import { OverrideContext, bindingMode } from 'aurelia-binding';
import { View, ViewFactory, ViewSlot } from 'aurelia-templating';

declare enum ActivationStrategy {
	/**
	 * Default activation strategy; the 'activate' lifecycle hook will be invoked when the model changes.
	 */
	InvokeLifecycle = "invoke-lifecycle",
	/**
	 * The view/view-model will be recreated, when the "model" changes.
	 */
	Replace = "replace"
}
/**
 * Used to compose a new view / view-model template or bind to an existing instance.
 */
export declare class Compose {
	/**
	 * Model to bind the custom element to.
	 *
	 * @property model
	 * @type {CustomElement}
	 */
	model: any;
	/**
	 * View to bind the custom element to.
	 *
	 * @property view
	 * @type {HtmlElement}
	 */
	view: any;
	/**
	 * View-model to bind the custom element's template to.
	 *
	 * @property viewModel
	 * @type {Class}
	 */
	viewModel: any;
	/**
	 * Strategy to activate the view-model. Default is "invoke-lifecycle".
	 * Bind "replace" to recreate the view/view-model when the model changes.
	 *
	 * @property activationStrategy
	 * @type {ActivationStrategy}
	 */
	activationStrategy: ActivationStrategy;
	/**
	 * SwapOrder to control the swapping order of the custom element's view.
	 *
	 * @property view
	 * @type {String}
	 */
	swapOrder: any;
	/**
	 * Creates an instance of Compose.
	 * @param element The Compose element.
	 * @param container The dependency injection container instance.
	 * @param compositionEngine CompositionEngine instance to compose the element.
	 * @param viewSlot The slot the view is injected in to.
	 * @param viewResources Collection of resources used to compile the the view.
	 * @param taskQueue The TaskQueue instance.
	 */
	constructor(element: any, container: any, compositionEngine: any, viewSlot: any, viewResources: any, taskQueue: any);
	/**
	 * Invoked when the component has been created.
	 *
	 * @param owningView The view that this component was created inside of.
	 */
	created(owningView: View): void;
	/**
	 * Used to set the bindingContext.
	 *
	 * @param bindingContext The context in which the view model is executed in.
	 * @param overrideContext The context in which the view model is executed in.
	 */
	bind(bindingContext: any, overrideContext: any): void;
	/**
	 * Unbinds the Compose.
	 */
	unbind(): void;
	/**
	 * Invoked everytime the bound model changes.
	 * @param newValue The new value.
	 * @param oldValue The old value.
	 */
	modelChanged(newValue: any, oldValue: any): void;
	/**
	 * Invoked everytime the bound view changes.
	 * @param newValue The new value.
	 * @param oldValue The old value.
	 */
	viewChanged(newValue: any, oldValue: any): void;
	/**
	 * Invoked everytime the bound view model changes.
	 * @param newValue The new value.
	 * @param oldValue The old value.
	 */
	viewModelChanged(newValue: any, oldValue: any): void;
}
declare class IfCore {
	constructor(viewFactory: ViewFactory, viewSlot: ViewSlot);
	bind(bindingContext: any, overrideContext: any): void;
	unbind(): void;
}
/**
 * Binding to conditionally include or not include template logic depending on returned result
 * - value should be Boolean or will be treated as such (truthy / falsey)
 */
export declare class If extends IfCore {
	condition: any;
	swapOrder: 'before' | 'with' | 'after';
	cache: boolean | string;
	/**
	 * Binds the if to the binding context and override context
	 * @param bindingContext The binding context
	 * @param overrideContext An override context for binding.
	 */
	bind(bindingContext: any, overrideContext: any): void;
	/**
	 * Invoked everytime value property changes.
	 * @param newValue The new value
	 */
	conditionChanged(newValue: any): void;
}
export declare class Else extends IfCore {
	constructor(viewFactory: any, viewSlot: any);
	bind(bindingContext: any, overrideContext: any): void;
}
/**
 * Creates a binding context for decandant elements to bind to.
 */
export declare class With {
	value: any;
	/**
	 * Creates an instance of With.
	 * @param viewFactory The factory generating the view.
	 * @param viewSlot The slot the view is injected in to.
	 */
	constructor(viewFactory: ViewFactory, viewSlot: ViewSlot);
	/**
	 * Binds the With with provided binding context and override context.
	 * @param bindingContext The binding context.
	 * @param overrideContext An override context for binding.
	 */
	bind(bindingContext: any, overrideContext: any): void;
	/**
	 * Invoked everytime the bound value changes.
	 * @param newValue The new value.
	 */
	valueChanged(newValue: any): void;
	/**
	 * Unbinds With
	 */
	unbind(): void;
}
/**
* An abstract base class for elements and attributes that repeat
* views.
*/
export declare class AbstractRepeater {
	constructor(options: any);
	/**
	 * Returns the number of views the repeater knows about.
	 *
	 * @return {Number}  the number of views.
	 */
	viewCount(): number;
	/**
	 * Returns all of the repeaters views as an array.
	 *
	 * @return {Array} The repeater's array of views;
	 */
	views(): any[];
	/**
	 * Returns a single view from the repeater at the provided index.
	 *
	 * @param {Number} index The index of the requested view.
	 * @return {View|ViewSlot} The requested view.
	 */
	view(index: any): any;
	/**
	 * Returns the matcher function to be used by the repeater, or null if strict matching is to be performed.
	 *
	 * @return {Function|null} The requested matcher function.
	 */
	matcher(): void;
	/**
	 * Adds a view to the repeater, binding the view to the
	 * provided contexts.
	 *
	 * @param {Object} bindingContext The binding context to bind the new view to.
	 * @param {Object} overrideContext A secondary binding context that can override the primary context.
	 */
	addView(bindingContext: any, overrideContext: any): void;
	/**
	 * Inserts a view to the repeater at a specific index, binding the view to the
	 * provided contexts.
	 *
	 * @param {Number} index The index at which to create the new view at.
	 * @param {Object} bindingContext The binding context to bind the new view to.
	 * @param {Object} overrideContext A secondary binding context that can override the primary context.
	 */
	insertView(index: any, bindingContext: any, overrideContext: any): void;
	/**
	 * Moves a view across the repeater.
	 *
	 * @param {Number} sourceIndex The index of the view to be moved.
	 * @param {Number} sourceIndex The index where the view should be placed at.
	 */
	moveView(sourceIndex: any, targetIndex: any): void;
	/**
	 * Removes all views from the repeater.
	 * @param {Boolean} returnToCache Should the view be returned to the view cache?
	 * @param {Boolean} skipAnimation Should the removal animation be skipped?
	 * @return {Promise|null}
	 */
	removeAllViews(returnToCache?: boolean, skipAnimation?: boolean): void;
	/**
	 * Removes an array of Views from the repeater.
	 *
	 * @param {Array} viewsToRemove The array of views to be removed.
	 * @param {Boolean} returnToCache Should the view be returned to the view cache?
	 * @param {Boolean} skipAnimation Should the removal animation be skipped?
	 * @return {Promise|null}
	 */
	removeViews(viewsToRemove: Array<View>, returnToCache?: boolean, skipAnimation?: boolean): void;
	/**
	 * Removes a view from the repeater at a specific index.
	 *
	 * @param {Number} index The index of the view to be removed.
	 * @param {Boolean} returnToCache Should the view be returned to the view cache?
	 * @param {Boolean} skipAnimation Should the removal animation be skipped?
	 * @return {Promise|null}
	 */
	removeView(index: number, returnToCache?: boolean, skipAnimation?: boolean): void;
	/**
	 * Forces a particular view to update it's bindings, called as part of
	 * an in-place processing of items for better performance
	 *
	 * @param {Object} view the target view for bindings updates
	 */
	updateBindings(view: View): void;
}
/**
 * Binding to iterate over iterable objects (Array, Map and Number) to genereate a template for each iteration.
 */
export declare class Repeat extends AbstractRepeater {
	/**
	 * Setting this to `true` to enable legacy behavior, where a repeat would take first `matcher` binding
	 * any where inside its view if there's no `matcher` binding on the repeated element itself.
	 *
	 * Default value is true to avoid breaking change
	 * @default true
	 */
	static useInnerMatcher: boolean;
	/**
	 * List of items to bind the repeater to.
	 *
	 * @property items
	 */
	items: any;
	/**
	 * Local variable which gets assigned on each iteration.
	 *
	 * @property local
	 */
	local: any;
	/**
	 * Key when iterating over Maps.
	 *
	 * @property key
	 */
	key: any;
	/**
	 * Value when iterating over Maps.
	 *
	 * @property value
	 */
	value: any;
	/**
   * Creates an instance of Repeat.
   * @param viewFactory The factory generating the view
   * @param instruction The instructions for how the element should be enhanced.
   * @param viewResources Collection of resources used to compile the the views.
   * @param viewSlot The slot the view is injected in to.
   * @param observerLocator The observer locator instance.
   * @param collectionStrategyLocator The strategy locator to locate best strategy to iterate the collection.
   */
	constructor(viewFactory: any, instruction: any, viewSlot: any, viewResources: any, observerLocator: any, strategyLocator: any);
	call(context: any, changes: any): void;
	/**
	* Binds the repeat to the binding context and override context.
	* @param bindingContext The binding context.
	* @param overrideContext An override context for binding.
	*/
	bind(bindingContext: any, overrideContext: any): void;
	/**
	* Unbinds the repeat
	*/
	unbind(): void;
	/**
	* Invoked everytime the item property changes.
	*/
	itemsChanged(): void;
	/**
	* Invoked when the underlying collection changes.
	*/
	handleCollectionMutated(collection: any, changes: any): void;
	/**
	* Invoked when the underlying inner collection changes.
	*/
	handleInnerCollectionMutated(collection: any, changes: any): void;
	viewCount(): any;
	views(): any;
	view(index: any): any;
	matcher(): any;
	addView(bindingContext: any, overrideContext: any): void;
	insertView(index: any, bindingContext: any, overrideContext: any): void;
	moveView(sourceIndex: any, targetIndex: any): void;
	removeAllViews(returnToCache: any, skipAnimation: any): any;
	removeViews(viewsToRemove: any, returnToCache: any, skipAnimation: any): any;
	removeView(index: any, returnToCache: any, skipAnimation: any): any;
	updateBindings(view: View): void;
}
/**
 * Binding to conditionally show markup in the DOM based on the value.
 * - different from "if" in that the markup is still added to the DOM, simply not shown.
 */
export declare class Show {
	value: any;
	/**
	 * Creates a new instance of Show.
	 * @param element Target element to conditionally show.
	 * @param animator The animator that conditionally adds or removes the aurelia-hide css class.
	 * @param domBoundary The DOM boundary. Used when the behavior appears within a component that utilizes the shadow DOM.
	 */
	constructor(element: any, animator: any, domBoundary: any);
	/**
	 * Invoked when the behavior is created.
	 */
	created(): void;
	/**
	 * Invoked everytime the bound value changes.
	 * @param newValue The new value.
	 */
	valueChanged(newValue: any): void;
	/**
	 * Binds the Show attribute.
	 */
	bind(bindingContext: any): void;
}
/**
 * Binding to conditionally show markup in the DOM based on the value.
 * - different from "if" in that the markup is still added to the DOM, simply not shown.
 */
export declare class Hide {
	/**
	 * Creates a new instance of Hide.
	 * @param element Target element to conditionally hide.
	 * @param animator The animator that conditionally adds or removes the aurelia-hide css class.
	 * @param domBoundary The DOM boundary. Used when the behavior appears within a component that utilizes the shadow DOM.
	 */
	constructor(element: any, animator: any, domBoundary: any);
	/**
	 * Invoked when the behavior is created.
	 */
	created(): void;
	/**
	 * Invoked everytime the bound value changes.
	 * @param newValue The new value.
	 */
	valueChanged(newValue: any): void;
	/**
	 * Binds the Hide attribute.
	 */
	bind(bindingContext: any): void;
	value(value: any): void;
}
/**
 * Default Html Sanitizer to prevent script injection.
 */
export declare class HTMLSanitizer {
	/**
	 * Sanitizes the provided input.
	 * @param input The input to be sanitized.
	 */
	sanitize(input: any): any;
}
/**
 * Simple html sanitization converter to preserve whitelisted elements and attributes on a bound property containing html.
 */
export declare class SanitizeHTMLValueConverter {
	/**
	 * Creates an instanse of the value converter.
	 * @param sanitizer The html sanitizer.
	 */
	constructor(sanitizer: HTMLSanitizer);
	/**
	 * Process the provided markup that flows to the view.
	 * @param untrustedMarkup The untrusted markup to be sanitized.
	 */
	toView(untrustedMarkup: any): any;
}
/**
 * Marks any part of a view to be replacable by the consumer.
 */
export declare class Replaceable {
	/**
	 * @param viewFactory target The factory generating the view.
	 * @param viewSlot viewSlot The slot the view is injected in to.
	 */
	constructor(viewFactory: ViewFactory, viewSlot: ViewSlot);
	/**
	 * Binds the replaceable to the binding context and override context.
	 * @param bindingContext The binding context.
	 * @param overrideContext An override context for binding.
	 */
	bind(bindingContext: any, overrideContext: any): void;
	/**
	 * Unbinds the replaceable.
	 */
	unbind(): void;
}
/**
 * CustomAttribute that binds provided DOM element's focus attribute with a property on the viewmodel.
 */
export declare class Focus {
	/**
	 * Creates an instance of Focus.
	 * @paramelement Target element on where attribute is placed on.
	 * @param taskQueue The TaskQueue instance.
	 */
	constructor(element: any, taskQueue: any);
	/**
	 * Invoked everytime the bound value changes.
	 * @param newValue The new value.
	 */
	valueChanged(newValue: any): void;
	/**
	 * Invoked when the attribute is attached to the DOM.
	 */
	attached(): void;
	/**
	 * Invoked when the attribute is detached from the DOM.
	 */
	detached(): void;
	handleEvent(e: any): void;
}
export declare class AttrBindingBehavior {
	bind(binding: any, source: any): void;
	unbind(binding: any, source: any): void;
}
export declare class OneTimeBindingBehavior {
	mode: bindingMode;
	constructor();
}
export declare class OneWayBindingBehavior {
	mode: bindingMode;
	constructor();
}
export declare class ToViewBindingBehavior {
	mode: bindingMode;
	constructor();
}
export declare class FromViewBindingBehavior {
	mode: bindingMode;
	constructor();
}
export declare class TwoWayBindingBehavior {
	mode: bindingMode;
	constructor();
}
export declare class ThrottleBindingBehavior {
	bind(binding: any, source: any, delay?: number): void;
	unbind(binding: any, source: any): void;
}
export declare class DebounceBindingBehavior {
	bind(binding: any, source: any, delay?: number): void;
	unbind(binding: any, source: any): void;
}
export declare class SelfBindingBehavior {
	bind(binding: any, source: any): void;
	unbind(binding: any, source: any): void;
}
export declare class SignalBindingBehavior {
	signals: any;
	constructor(bindingSignaler: any);
	bind(binding: any, source: any, ...names: any[]): void;
	unbind(binding: any, source: any): void;
}
export declare class BindingSignaler {
	signals: {};
	signal(name: string): void;
}
export declare class UpdateTriggerBindingBehavior {
	bind(binding: any, source: any, ...events: any[]): void;
	unbind(binding: any, source: any): void;
}
/**
 * A strategy is for repeating a template over an iterable or iterable-like object.
 */
export interface RepeatStrategy {
	instanceChanged(repeat: Repeat, items: any): void;
	instanceMutated(repeat: Repeat, items: any, changes: any): void;
	getCollectionObserver(observerLocator: any, items: any): any;
}
/**
 * Locates the best strategy to best repeating a template over different types of collections.
 * Custom strategies can be plugged in as well.
 */
export declare class RepeatStrategyLocator {
	/**
	 * Creates a new RepeatStrategyLocator.
	 */
	constructor();
	/**
	 * Adds a repeat strategy to be located when repeating a template over different collection types.
	 * @param strategy A repeat strategy that can iterate a specific collection type.
	 */
	addStrategy(matcher: (items: any) => boolean, strategy: RepeatStrategy): void;
	/**
	 * Gets the best strategy to handle iteration.
	 */
	getStrategy(items: any): RepeatStrategy;
}
/**
 * A strategy for repeating a template over null or undefined (does nothing)
 */
export declare class NullRepeatStrategy {
	instanceChanged(repeat: any, items: any): void;
	getCollectionObserver(observerLocator: any, items: any): void;
}
/**
 * A strategy for repeating a template over an array.
 */
export declare class ArrayRepeatStrategy {
	/**
	 * Gets an observer for the specified collection.
	 * @param observerLocator The observer locator instance.
	 * @param items The items to be observed.
	 */
	getCollectionObserver(observerLocator: any, items: any): any;
	/**
	 * Handle the repeat's collection instance changing.
	 * @param repeat The repeater instance.
	 * @param items The new array instance.
	 */
	instanceChanged(repeat: any, items: any): void;
	/**
	 * Handle the repeat's collection instance mutating.
	 * @param repeat The repeat instance.
	 * @param array The modified array.
	 * @param splices Records of array changes.
	 */
	instanceMutated(repeat: any, array: any, splices: any): void;
}
/**
 * A strategy for repeating a template over a Map.
 */
export declare class MapRepeatStrategy {
	/**
	 * Gets a Map observer.
	 * @param items The items to be observed.
	 */
	getCollectionObserver(observerLocator: any, items: any): any;
	/**
	 * Process the provided Map entries.
	 * @param items The entries to process.
	 */
	instanceChanged(repeat: any, items: any): void;
	/**
	 * Handle changes in a Map collection.
	 * @param map The underlying Map collection.
	 * @param records The change records.
	 */
	instanceMutated(repeat: any, map: any, records: any): void;
}
/**
 * A strategy for repeating a template over a Set.
 */
export declare class SetRepeatStrategy {
	/**
	 * Gets a Set observer.
	 * @param items The items to be observed.
	 */
	getCollectionObserver(observerLocator: any, items: any): any;
	/**
	 * Process the provided Set entries.
	 * @param items The entries to process.
	 */
	instanceChanged(repeat: any, items: any): void;
	/**
	 * Handle changes in a Set collection.
	 * @param repeat The repeat instance.
	 * @param set The underlying Set collection.
	 * @param records The change records.
	 */
	instanceMutated(repeat: any, set: any, records: any): void;
}
/**
 * A strategy for repeating a template over a number.
 */
export declare class NumberRepeatStrategy {
	/**
	 * Return the strategies collection observer. In this case none.
	 */
	getCollectionObserver(): any;
	/**
	 * Process the provided Number.
	 * @param value The Number of how many time to iterate.
	 */
	instanceChanged(repeat: any, value: any): void;
}
/**
 * Creates a complete override context.
 * @param data The item's value.
 * @param index The item's index.
 * @param length The collections total length.
 * @param key The key in a key/value pair.
 */
export declare function createFullOverrideContext(repeat: any, data: any, index: any, length: any, key?: string): OverrideContext;
/**
 * Updates the override context.
 * @param context The context to be updated.
 * @param index The context's index.
 * @param length The collection's length.
 */
export declare function updateOverrideContext(overrideContext: any, index: any, length: any): void;
/**
 * Gets a repeat instruction's source expression.
 */
export declare function getItemsSourceExpression(instruction: any, attrName: any): any;
/**
 * Unwraps an expression to expose the inner, pre-converted / behavior-free expression.
 */
export declare function unwrapExpression(expression: any): any;
/**
 * Returns whether an expression has the OneTimeBindingBehavior applied.
 */
export declare function isOneTime(expression: any): boolean;
/**
 * Forces a binding instance to reevaluate.
 */
export declare function updateOneTimeBinding(binding: any): void;
export declare function viewsRequireLifecycle(viewFactory: any): any;
export declare function configure(config: any): void;