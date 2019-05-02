import { Container, inject, Optional } from 'aurelia-dependency-injection';
import { DOM, FEATURE } from 'aurelia-pal';
import { TaskQueue } from 'aurelia-task-queue';
import { CompositionEngine, ViewSlot, ViewResources, bindable, noView, customElement, customAttribute, templateController, BoundViewFactory, TargetInstruction, Animator, resource, useView, useShadowDOM, ViewEngine } from 'aurelia-templating';
import { createOverrideContext, bindingMode, BindingBehavior, ValueConverter, sourceContext, mergeSplice, ObserverLocator, valueConverter, DataAttributeObserver, bindingBehavior, targetContext, EventSubscriber } from 'aurelia-binding';
import { getLogger } from 'aurelia-logging';
import { Loader } from 'aurelia-loader';
import { relativeToFile } from 'aurelia-path';
import { mixin } from 'aurelia-metadata';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

var Compose = (function () {
    function Compose(element, container, compositionEngine, viewSlot, viewResources, taskQueue) {
        this.element = element;
        this.container = container;
        this.compositionEngine = compositionEngine;
        this.viewSlot = viewSlot;
        this.viewResources = viewResources;
        this.taskQueue = taskQueue;
        this.currentController = null;
        this.currentViewModel = null;
        this.changes = Object.create(null);
    }
    Compose.inject = function () {
        return [DOM.Element, Container, CompositionEngine, ViewSlot, ViewResources, TaskQueue];
    };
    Compose.prototype.created = function (owningView) {
        this.owningView = owningView;
    };
    Compose.prototype.bind = function (bindingContext, overrideContext) {
        this.bindingContext = bindingContext;
        this.overrideContext = overrideContext;
        var changes = this.changes;
        changes.view = this.view;
        changes.viewModel = this.viewModel;
        changes.model = this.model;
        if (!this.pendingTask) {
            processChanges(this);
        }
    };
    Compose.prototype.unbind = function () {
        this.changes = Object.create(null);
        this.bindingContext = null;
        this.overrideContext = null;
        var returnToCache = true;
        var skipAnimation = true;
        this.viewSlot.removeAll(returnToCache, skipAnimation);
    };
    Compose.prototype.modelChanged = function (newValue, oldValue) {
        this.changes.model = newValue;
        requestUpdate(this);
    };
    Compose.prototype.viewChanged = function (newValue, oldValue) {
        this.changes.view = newValue;
        requestUpdate(this);
    };
    Compose.prototype.viewModelChanged = function (newValue, oldValue) {
        this.changes.viewModel = newValue;
        requestUpdate(this);
    };
    __decorate([
        bindable
    ], Compose.prototype, "model", void 0);
    __decorate([
        bindable
    ], Compose.prototype, "view", void 0);
    __decorate([
        bindable
    ], Compose.prototype, "viewModel", void 0);
    __decorate([
        bindable
    ], Compose.prototype, "swapOrder", void 0);
    Compose = __decorate([
        noView,
        customElement('compose')
    ], Compose);
    return Compose;
}());
function isEmpty(obj) {
    for (var _ in obj) {
        return false;
    }
    return true;
}
function tryActivateViewModel(vm, model) {
    if (vm && typeof vm.activate === 'function') {
        return Promise.resolve(vm.activate(model));
    }
}
function createInstruction(composer, instruction) {
    return Object.assign(instruction, {
        bindingContext: composer.bindingContext,
        overrideContext: composer.overrideContext,
        owningView: composer.owningView,
        container: composer.container,
        viewSlot: composer.viewSlot,
        viewResources: composer.viewResources,
        currentController: composer.currentController,
        host: composer.element,
        swapOrder: composer.swapOrder
    });
}
function processChanges(composer) {
    var changes = composer.changes;
    composer.changes = Object.create(null);
    if (!('view' in changes) && !('viewModel' in changes) && ('model' in changes)) {
        composer.pendingTask = tryActivateViewModel(composer.currentViewModel, changes.model);
        if (!composer.pendingTask) {
            return;
        }
    }
    else {
        var instruction = {
            view: composer.view,
            viewModel: composer.currentViewModel || composer.viewModel,
            model: composer.model
        };
        instruction = Object.assign(instruction, changes);
        instruction = createInstruction(composer, instruction);
        composer.pendingTask = composer.compositionEngine.compose(instruction).then(function (controller) {
            composer.currentController = controller;
            composer.currentViewModel = controller ? controller.viewModel : null;
        });
    }
    composer.pendingTask = composer.pendingTask
        .then(function () {
        completeCompositionTask(composer);
    }, function (reason) {
        completeCompositionTask(composer);
        throw reason;
    });
}
function completeCompositionTask(composer) {
    composer.pendingTask = null;
    if (!isEmpty(composer.changes)) {
        processChanges(composer);
    }
}
function requestUpdate(composer) {
    if (composer.pendingTask || composer.updateRequested) {
        return;
    }
    composer.updateRequested = true;
    composer.taskQueue.queueMicroTask(function () {
        composer.updateRequested = false;
        processChanges(composer);
    });
}

var IfCore = (function () {
    function IfCore(viewFactory, viewSlot) {
        this.viewFactory = viewFactory;
        this.viewSlot = viewSlot;
        this.view = null;
        this.bindingContext = null;
        this.overrideContext = null;
        this.showing = false;
        this.cache = true;
    }
    IfCore.prototype.bind = function (bindingContext, overrideContext) {
        this.bindingContext = bindingContext;
        this.overrideContext = overrideContext;
    };
    IfCore.prototype.unbind = function () {
        if (this.view === null) {
            return;
        }
        this.view.unbind();
        if (!this.viewFactory.isCaching) {
            return;
        }
        if (this.showing) {
            this.showing = false;
            this.viewSlot.remove(this.view, true, true);
        }
        else {
            this.view.returnToCache();
        }
        this.view = null;
    };
    IfCore.prototype._show = function () {
        if (this.showing) {
            if (!this.view.isBound) {
                this.view.bind(this.bindingContext, this.overrideContext);
            }
            return;
        }
        if (this.view === null) {
            this.view = this.viewFactory.create();
        }
        if (!this.view.isBound) {
            this.view.bind(this.bindingContext, this.overrideContext);
        }
        this.showing = true;
        return this.viewSlot.add(this.view);
    };
    IfCore.prototype._hide = function () {
        var _this = this;
        if (!this.showing) {
            return;
        }
        this.showing = false;
        var removed = this.viewSlot.remove(this.view);
        if (removed instanceof Promise) {
            return removed.then(function () {
                _this._unbindView();
            });
        }
        this._unbindView();
    };
    IfCore.prototype._unbindView = function () {
        var cache = this.cache === 'false' ? false : !!this.cache;
        this.view.unbind();
        if (!cache) {
            this.view = null;
        }
    };
    return IfCore;
}());

var If = (function (_super) {
    __extends(If, _super);
    function If() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.cache = true;
        return _this;
    }
    If.prototype.bind = function (bindingContext, overrideContext) {
        _super.prototype.bind.call(this, bindingContext, overrideContext);
        if (this.condition) {
            this._show();
        }
        else {
            this._hide();
        }
    };
    If.prototype.conditionChanged = function (newValue) {
        this._update(newValue);
    };
    If.prototype._update = function (show) {
        var _this = this;
        if (this.animating) {
            return;
        }
        var promise;
        if (this.elseVm) {
            promise = show ? this._swap(this.elseVm, this) : this._swap(this, this.elseVm);
        }
        else {
            promise = show ? this._show() : this._hide();
        }
        if (promise) {
            this.animating = true;
            promise.then(function () {
                _this.animating = false;
                if (_this.condition !== _this.showing) {
                    _this._update(_this.condition);
                }
            });
        }
    };
    If.prototype._swap = function (remove, add) {
        switch (this.swapOrder) {
            case 'before':
                return Promise.resolve(add._show()).then(function () { return remove._hide(); });
            case 'with':
                return Promise.all([remove._hide(), add._show()]);
            default:
                var promise = remove._hide();
                return promise ? promise.then(function () { return add._show(); }) : add._show();
        }
    };
    __decorate([
        bindable({ primaryProperty: true })
    ], If.prototype, "condition", void 0);
    __decorate([
        bindable
    ], If.prototype, "swapOrder", void 0);
    __decorate([
        bindable
    ], If.prototype, "cache", void 0);
    If = __decorate([
        customAttribute('if'),
        templateController,
        inject(BoundViewFactory, ViewSlot)
    ], If);
    return If;
}(IfCore));

var Else = (function (_super) {
    __extends(Else, _super);
    function Else(viewFactory, viewSlot) {
        var _this = _super.call(this, viewFactory, viewSlot) || this;
        _this._registerInIf();
        return _this;
    }
    Else.prototype.bind = function (bindingContext, overrideContext) {
        _super.prototype.bind.call(this, bindingContext, overrideContext);
        if (this.ifVm.condition) {
            this._hide();
        }
        else {
            this._show();
        }
    };
    Else.prototype._registerInIf = function () {
        var previous = this.viewSlot.anchor.previousSibling;
        while (previous && !previous.au) {
            previous = previous.previousSibling;
        }
        if (!previous || !previous.au.if) {
            throw new Error("Can't find matching If for Else custom attribute.");
        }
        this.ifVm = previous.au.if.viewModel;
        this.ifVm.elseVm = this;
    };
    Else = __decorate([
        customAttribute('else'),
        templateController,
        inject(BoundViewFactory, ViewSlot)
    ], Else);
    return Else;
}(IfCore));

var With = (function () {
    function With(viewFactory, viewSlot) {
        this.viewFactory = viewFactory;
        this.viewSlot = viewSlot;
        this.parentOverrideContext = null;
        this.view = null;
    }
    With.prototype.bind = function (bindingContext, overrideContext) {
        this.parentOverrideContext = overrideContext;
        this.valueChanged(this.value);
    };
    With.prototype.valueChanged = function (newValue) {
        var overrideContext = createOverrideContext(newValue, this.parentOverrideContext);
        var view = this.view;
        if (!view) {
            view = this.view = this.viewFactory.create();
            view.bind(newValue, overrideContext);
            this.viewSlot.add(view);
        }
        else {
            view.bind(newValue, overrideContext);
        }
    };
    With.prototype.unbind = function () {
        var view = this.view;
        this.parentOverrideContext = null;
        if (view) {
            view.unbind();
        }
    };
    With = __decorate([
        customAttribute('with'),
        templateController,
        inject(BoundViewFactory, ViewSlot)
    ], With);
    return With;
}());

var oneTime = bindingMode.oneTime;
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
    }
    else {
        bindingContext[repeat.local] = data;
    }
    updateOverrideContext(overrideContext, index, length);
    return overrideContext;
}
function updateOverrideContext(overrideContext, index, length) {
    var first = (index === 0);
    var last = (index === length - 1);
    var even = index % 2 === 0;
    overrideContext.$index = index;
    overrideContext.$first = first;
    overrideContext.$last = last;
    overrideContext.$middle = !(first || last);
    overrideContext.$odd = !even;
    overrideContext.$even = even;
}
function getItemsSourceExpression(instruction, attrName) {
    return instruction.behaviorInstructions
        .filter(function (bi) { return bi.originalAttrName === attrName; })[0]
        .attributes
        .items
        .sourceExpression;
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
    }
    else if (binding.updateOneTimeBindings) {
        binding.updateOneTimeBindings();
    }
}
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

var ArrayRepeatStrategy = (function () {
    function ArrayRepeatStrategy() {
    }
    ArrayRepeatStrategy.prototype.getCollectionObserver = function (observerLocator, items) {
        return observerLocator.getArrayObserver(items);
    };
    ArrayRepeatStrategy.prototype.instanceChanged = function (repeat, items) {
        var _this = this;
        var itemsLength = items.length;
        if (!items || itemsLength === 0) {
            repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
            return;
        }
        var children = repeat.views();
        var viewsLength = children.length;
        if (viewsLength === 0) {
            this._standardProcessInstanceChanged(repeat, items);
            return;
        }
        if (repeat.viewsRequireLifecycle) {
            var childrenSnapshot = children.slice(0);
            var itemNameInBindingContext = repeat.local;
            var matcher_1 = repeat.matcher();
            var itemsPreviouslyInViews_1 = [];
            var viewsToRemove = [];
            for (var index = 0; index < viewsLength; index++) {
                var view = childrenSnapshot[index];
                var oldItem = view.bindingContext[itemNameInBindingContext];
                if (indexOf(items, oldItem, matcher_1) === -1) {
                    viewsToRemove.push(view);
                }
                else {
                    itemsPreviouslyInViews_1.push(oldItem);
                }
            }
            var updateViews = void 0;
            var removePromise = void 0;
            if (itemsPreviouslyInViews_1.length > 0) {
                removePromise = repeat.removeViews(viewsToRemove, true, !repeat.viewsRequireLifecycle);
                updateViews = function () {
                    for (var index = 0; index < itemsLength; index++) {
                        var item = items[index];
                        var indexOfView = indexOf(itemsPreviouslyInViews_1, item, matcher_1, index);
                        var view = void 0;
                        if (indexOfView === -1) {
                            var overrideContext = createFullOverrideContext(repeat, items[index], index, itemsLength);
                            repeat.insertView(index, overrideContext.bindingContext, overrideContext);
                            itemsPreviouslyInViews_1.splice(index, 0, undefined);
                        }
                        else if (indexOfView === index) {
                            view = children[indexOfView];
                            itemsPreviouslyInViews_1[indexOfView] = undefined;
                        }
                        else {
                            view = children[indexOfView];
                            repeat.moveView(indexOfView, index);
                            itemsPreviouslyInViews_1.splice(indexOfView, 1);
                            itemsPreviouslyInViews_1.splice(index, 0, undefined);
                        }
                        if (view) {
                            updateOverrideContext(view.overrideContext, index, itemsLength);
                        }
                    }
                    _this._inPlaceProcessItems(repeat, items);
                };
            }
            else {
                removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
                updateViews = function () { return _this._standardProcessInstanceChanged(repeat, items); };
            }
            if (removePromise instanceof Promise) {
                removePromise.then(updateViews);
            }
            else {
                updateViews();
            }
        }
        else {
            this._inPlaceProcessItems(repeat, items);
        }
    };
    ArrayRepeatStrategy.prototype._standardProcessInstanceChanged = function (repeat, items) {
        for (var i = 0, ii = items.length; i < ii; i++) {
            var overrideContext = createFullOverrideContext(repeat, items[i], i, ii);
            repeat.addView(overrideContext.bindingContext, overrideContext);
        }
    };
    ArrayRepeatStrategy.prototype._inPlaceProcessItems = function (repeat, items) {
        var itemsLength = items.length;
        var viewsLength = repeat.viewCount();
        while (viewsLength > itemsLength) {
            viewsLength--;
            repeat.removeView(viewsLength, true, !repeat.viewsRequireLifecycle);
        }
        var local = repeat.local;
        for (var i = 0; i < viewsLength; i++) {
            var view = repeat.view(i);
            var last = i === itemsLength - 1;
            var middle = i !== 0 && !last;
            var bindingContext = view.bindingContext;
            var overrideContext = view.overrideContext;
            if (bindingContext[local] === items[i]
                && overrideContext.$middle === middle
                && overrideContext.$last === last) {
                continue;
            }
            bindingContext[local] = items[i];
            overrideContext.$middle = middle;
            overrideContext.$last = last;
            repeat.updateBindings(view);
        }
        for (var i = viewsLength; i < itemsLength; i++) {
            var overrideContext = createFullOverrideContext(repeat, items[i], i, itemsLength);
            repeat.addView(overrideContext.bindingContext, overrideContext);
        }
    };
    ArrayRepeatStrategy.prototype.instanceMutated = function (repeat, array, splices) {
        var _this = this;
        if (repeat.__queuedSplices) {
            for (var i = 0, ii = splices.length; i < ii; ++i) {
                var _a = splices[i], index = _a.index, removed = _a.removed, addedCount = _a.addedCount;
                mergeSplice(repeat.__queuedSplices, index, removed, addedCount);
            }
            repeat.__array = array.slice(0);
            return;
        }
        var maybePromise = this._runSplices(repeat, array.slice(0), splices);
        if (maybePromise instanceof Promise) {
            var queuedSplices_1 = repeat.__queuedSplices = [];
            var runQueuedSplices_1 = function () {
                if (!queuedSplices_1.length) {
                    repeat.__queuedSplices = undefined;
                    repeat.__array = undefined;
                    return;
                }
                var nextPromise = _this._runSplices(repeat, repeat.__array, queuedSplices_1) || Promise.resolve();
                queuedSplices_1 = repeat.__queuedSplices = [];
                nextPromise.then(runQueuedSplices_1);
            };
            maybePromise.then(runQueuedSplices_1);
        }
    };
    ArrayRepeatStrategy.prototype._runSplices = function (repeat, array, splices) {
        var _this = this;
        var removeDelta = 0;
        var rmPromises = [];
        for (var i = 0, ii = splices.length; i < ii; ++i) {
            var splice = splices[i];
            var removed = splice.removed;
            for (var j = 0, jj = removed.length; j < jj; ++j) {
                var viewOrPromise = repeat.removeView(splice.index + removeDelta + rmPromises.length, true);
                if (viewOrPromise instanceof Promise) {
                    rmPromises.push(viewOrPromise);
                }
            }
            removeDelta -= splice.addedCount;
        }
        if (rmPromises.length > 0) {
            return Promise.all(rmPromises).then(function () {
                var spliceIndexLow = _this._handleAddedSplices(repeat, array, splices);
                updateOverrideContexts(repeat.views(), spliceIndexLow);
            });
        }
        var spliceIndexLow = this._handleAddedSplices(repeat, array, splices);
        updateOverrideContexts(repeat.views(), spliceIndexLow);
        return undefined;
    };
    ArrayRepeatStrategy.prototype._handleAddedSplices = function (repeat, array, splices) {
        var spliceIndex;
        var spliceIndexLow;
        var arrayLength = array.length;
        for (var i = 0, ii = splices.length; i < ii; ++i) {
            var splice = splices[i];
            var addIndex = spliceIndex = splice.index;
            var end = splice.index + splice.addedCount;
            if (typeof spliceIndexLow === 'undefined' || spliceIndexLow === null || spliceIndexLow > splice.index) {
                spliceIndexLow = spliceIndex;
            }
            for (; addIndex < end; ++addIndex) {
                var overrideContext = createFullOverrideContext(repeat, array[addIndex], addIndex, arrayLength);
                repeat.insertView(addIndex, overrideContext.bindingContext, overrideContext);
            }
        }
        return spliceIndexLow;
    };
    return ArrayRepeatStrategy;
}());

var MapRepeatStrategy = (function () {
    function MapRepeatStrategy() {
    }
    MapRepeatStrategy.prototype.getCollectionObserver = function (observerLocator, items) {
        return observerLocator.getMapObserver(items);
    };
    MapRepeatStrategy.prototype.instanceChanged = function (repeat, items) {
        var _this = this;
        var removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
        if (removePromise instanceof Promise) {
            removePromise.then(function () { return _this._standardProcessItems(repeat, items); });
            return;
        }
        this._standardProcessItems(repeat, items);
    };
    MapRepeatStrategy.prototype._standardProcessItems = function (repeat, items) {
        var index = 0;
        var overrideContext;
        items.forEach(function (value, key) {
            overrideContext = createFullOverrideContext(repeat, value, index, items.size, key);
            repeat.addView(overrideContext.bindingContext, overrideContext);
            ++index;
        });
    };
    MapRepeatStrategy.prototype.instanceMutated = function (repeat, map, records) {
        var key;
        var i;
        var ii;
        var overrideContext;
        var removeIndex;
        var addIndex;
        var record;
        var rmPromises = [];
        var viewOrPromise;
        for (i = 0, ii = records.length; i < ii; ++i) {
            record = records[i];
            key = record.key;
            switch (record.type) {
                case 'update':
                    removeIndex = this._getViewIndexByKey(repeat, key);
                    viewOrPromise = repeat.removeView(removeIndex, true, !repeat.viewsRequireLifecycle);
                    if (viewOrPromise instanceof Promise) {
                        rmPromises.push(viewOrPromise);
                    }
                    overrideContext = createFullOverrideContext(repeat, map.get(key), removeIndex, map.size, key);
                    repeat.insertView(removeIndex, overrideContext.bindingContext, overrideContext);
                    break;
                case 'add':
                    addIndex = repeat.viewCount() <= map.size - 1 ? repeat.viewCount() : map.size - 1;
                    overrideContext = createFullOverrideContext(repeat, map.get(key), addIndex, map.size, key);
                    repeat.insertView(map.size - 1, overrideContext.bindingContext, overrideContext);
                    break;
                case 'delete':
                    if (record.oldValue === undefined) {
                        return;
                    }
                    removeIndex = this._getViewIndexByKey(repeat, key);
                    viewOrPromise = repeat.removeView(removeIndex, true, !repeat.viewsRequireLifecycle);
                    if (viewOrPromise instanceof Promise) {
                        rmPromises.push(viewOrPromise);
                    }
                    break;
                case 'clear':
                    repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
                    break;
                default:
                    continue;
            }
        }
        if (rmPromises.length > 0) {
            Promise.all(rmPromises).then(function () {
                updateOverrideContexts(repeat.views(), 0);
            });
        }
        else {
            updateOverrideContexts(repeat.views(), 0);
        }
    };
    MapRepeatStrategy.prototype._getViewIndexByKey = function (repeat, key) {
        var i;
        var ii;
        var child;
        for (i = 0, ii = repeat.viewCount(); i < ii; ++i) {
            child = repeat.view(i);
            if (child.bindingContext[repeat.key] === key) {
                return i;
            }
        }
        return undefined;
    };
    return MapRepeatStrategy;
}());

var NullRepeatStrategy = (function () {
    function NullRepeatStrategy() {
    }
    NullRepeatStrategy.prototype.instanceChanged = function (repeat, items) {
        repeat.removeAllViews(true);
    };
    NullRepeatStrategy.prototype.getCollectionObserver = function (observerLocator, items) {
    };
    return NullRepeatStrategy;
}());

var NumberRepeatStrategy = (function () {
    function NumberRepeatStrategy() {
    }
    NumberRepeatStrategy.prototype.getCollectionObserver = function () {
        return null;
    };
    NumberRepeatStrategy.prototype.instanceChanged = function (repeat, value) {
        var _this = this;
        var removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
        if (removePromise instanceof Promise) {
            removePromise.then(function () { return _this._standardProcessItems(repeat, value); });
            return;
        }
        this._standardProcessItems(repeat, value);
    };
    NumberRepeatStrategy.prototype._standardProcessItems = function (repeat, value) {
        var childrenLength = repeat.viewCount();
        var i;
        var ii;
        var overrideContext;
        var viewsToRemove;
        value = Math.floor(value);
        viewsToRemove = childrenLength - value;
        if (viewsToRemove > 0) {
            if (viewsToRemove > childrenLength) {
                viewsToRemove = childrenLength;
            }
            for (i = 0, ii = viewsToRemove; i < ii; ++i) {
                repeat.removeView(childrenLength - (i + 1), true, !repeat.viewsRequireLifecycle);
            }
            return;
        }
        for (i = childrenLength, ii = value; i < ii; ++i) {
            overrideContext = createFullOverrideContext(repeat, i, i, ii);
            repeat.addView(overrideContext.bindingContext, overrideContext);
        }
        updateOverrideContexts(repeat.views(), 0);
    };
    return NumberRepeatStrategy;
}());

var SetRepeatStrategy = (function () {
    function SetRepeatStrategy() {
    }
    SetRepeatStrategy.prototype.getCollectionObserver = function (observerLocator, items) {
        return observerLocator.getSetObserver(items);
    };
    SetRepeatStrategy.prototype.instanceChanged = function (repeat, items) {
        var _this = this;
        var removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
        if (removePromise instanceof Promise) {
            removePromise.then(function () { return _this._standardProcessItems(repeat, items); });
            return;
        }
        this._standardProcessItems(repeat, items);
    };
    SetRepeatStrategy.prototype._standardProcessItems = function (repeat, items) {
        var index = 0;
        var overrideContext;
        items.forEach(function (value) {
            overrideContext = createFullOverrideContext(repeat, value, index, items.size);
            repeat.addView(overrideContext.bindingContext, overrideContext);
            ++index;
        });
    };
    SetRepeatStrategy.prototype.instanceMutated = function (repeat, set, records) {
        var value;
        var i;
        var ii;
        var overrideContext;
        var removeIndex;
        var record;
        var rmPromises = [];
        var viewOrPromise;
        for (i = 0, ii = records.length; i < ii; ++i) {
            record = records[i];
            value = record.value;
            switch (record.type) {
                case 'add':
                    var size = Math.max(set.size - 1, 0);
                    overrideContext = createFullOverrideContext(repeat, value, size, set.size);
                    repeat.insertView(size, overrideContext.bindingContext, overrideContext);
                    break;
                case 'delete':
                    removeIndex = this._getViewIndexByValue(repeat, value);
                    viewOrPromise = repeat.removeView(removeIndex, true, !repeat.viewsRequireLifecycle);
                    if (viewOrPromise instanceof Promise) {
                        rmPromises.push(viewOrPromise);
                    }
                    break;
                case 'clear':
                    repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
                    break;
                default:
                    continue;
            }
        }
        if (rmPromises.length > 0) {
            Promise.all(rmPromises).then(function () {
                updateOverrideContexts(repeat.views(), 0);
            });
        }
        else {
            updateOverrideContexts(repeat.views(), 0);
        }
    };
    SetRepeatStrategy.prototype._getViewIndexByValue = function (repeat, value) {
        var i;
        var ii;
        var child;
        for (i = 0, ii = repeat.viewCount(); i < ii; ++i) {
            child = repeat.view(i);
            if (child.bindingContext[repeat.local] === value) {
                return i;
            }
        }
        return undefined;
    };
    return SetRepeatStrategy;
}());

var RepeatStrategyLocator = (function () {
    function RepeatStrategyLocator() {
        this.matchers = [];
        this.strategies = [];
        this.addStrategy(function (items) { return items === null || items === undefined; }, new NullRepeatStrategy());
        this.addStrategy(function (items) { return items instanceof Array; }, new ArrayRepeatStrategy());
        this.addStrategy(function (items) { return items instanceof Map; }, new MapRepeatStrategy());
        this.addStrategy(function (items) { return items instanceof Set; }, new SetRepeatStrategy());
        this.addStrategy(function (items) { return typeof items === 'number'; }, new NumberRepeatStrategy());
    }
    RepeatStrategyLocator.prototype.addStrategy = function (matcher, strategy) {
        this.matchers.push(matcher);
        this.strategies.push(strategy);
    };
    RepeatStrategyLocator.prototype.getStrategy = function (items) {
        var matchers = this.matchers;
        for (var i = 0, ii = matchers.length; i < ii; ++i) {
            if (matchers[i](items)) {
                return this.strategies[i];
            }
        }
        return null;
    };
    return RepeatStrategyLocator;
}());

var lifecycleOptionalBehaviors = ['focus', 'if', 'else', 'repeat', 'show', 'hide', 'with'];
function behaviorRequiresLifecycle(instruction) {
    var t = instruction.type;
    var name = t.elementName !== null ? t.elementName : t.attributeName;
    return lifecycleOptionalBehaviors.indexOf(name) === -1 && (t.handlesAttached || t.handlesBind || t.handlesCreated || t.handlesDetached || t.handlesUnbind)
        || t.viewFactory && viewsRequireLifecycle(t.viewFactory)
        || instruction.viewFactory && viewsRequireLifecycle(instruction.viewFactory);
}
function targetRequiresLifecycle(instruction) {
    var behaviors = instruction.behaviorInstructions;
    if (behaviors) {
        var i = behaviors.length;
        while (i--) {
            if (behaviorRequiresLifecycle(behaviors[i])) {
                return true;
            }
        }
    }
    return instruction.viewFactory && viewsRequireLifecycle(instruction.viewFactory);
}
function viewsRequireLifecycle(viewFactory) {
    if ('_viewsRequireLifecycle' in viewFactory) {
        return viewFactory._viewsRequireLifecycle;
    }
    viewFactory._viewsRequireLifecycle = false;
    if (viewFactory.viewFactory) {
        viewFactory._viewsRequireLifecycle = viewsRequireLifecycle(viewFactory.viewFactory);
        return viewFactory._viewsRequireLifecycle;
    }
    if (viewFactory.template.querySelector('.au-animate')) {
        viewFactory._viewsRequireLifecycle = true;
        return true;
    }
    for (var id in viewFactory.instructions) {
        if (targetRequiresLifecycle(viewFactory.instructions[id])) {
            viewFactory._viewsRequireLifecycle = true;
            return true;
        }
    }
    viewFactory._viewsRequireLifecycle = false;
    return false;
}

var AbstractRepeater = (function () {
    function AbstractRepeater(options) {
        Object.assign(this, {
            local: 'items',
            viewsRequireLifecycle: true
        }, options);
    }
    AbstractRepeater.prototype.viewCount = function () {
        throw new Error('subclass must implement `viewCount`');
    };
    AbstractRepeater.prototype.views = function () {
        throw new Error('subclass must implement `views`');
    };
    AbstractRepeater.prototype.view = function (index) {
        throw new Error('subclass must implement `view`');
    };
    AbstractRepeater.prototype.matcher = function () {
        throw new Error('subclass must implement `matcher`');
    };
    AbstractRepeater.prototype.addView = function (bindingContext, overrideContext) {
        throw new Error('subclass must implement `addView`');
    };
    AbstractRepeater.prototype.insertView = function (index, bindingContext, overrideContext) {
        throw new Error('subclass must implement `insertView`');
    };
    AbstractRepeater.prototype.moveView = function (sourceIndex, targetIndex) {
        throw new Error('subclass must implement `moveView`');
    };
    AbstractRepeater.prototype.removeAllViews = function (returnToCache, skipAnimation) {
        throw new Error('subclass must implement `removeAllViews`');
    };
    AbstractRepeater.prototype.removeViews = function (viewsToRemove, returnToCache, skipAnimation) {
        throw new Error('subclass must implement `removeView`');
    };
    AbstractRepeater.prototype.removeView = function (index, returnToCache, skipAnimation) {
        throw new Error('subclass must implement `removeView`');
    };
    AbstractRepeater.prototype.updateBindings = function (view) {
        throw new Error('subclass must implement `updateBindings`');
    };
    return AbstractRepeater;
}());

var Repeat = (function (_super) {
    __extends(Repeat, _super);
    function Repeat(viewFactory, instruction, viewSlot, viewResources, observerLocator, strategyLocator) {
        var _this = _super.call(this, {
            local: 'item',
            viewsRequireLifecycle: viewsRequireLifecycle(viewFactory)
        }) || this;
        _this.viewFactory = viewFactory;
        _this.instruction = instruction;
        _this.viewSlot = viewSlot;
        _this.lookupFunctions = viewResources.lookupFunctions;
        _this.observerLocator = observerLocator;
        _this.key = 'key';
        _this.value = 'value';
        _this.strategyLocator = strategyLocator;
        _this.ignoreMutation = false;
        _this.sourceExpression = getItemsSourceExpression(_this.instruction, 'repeat.for');
        _this.isOneTime = isOneTime(_this.sourceExpression);
        _this.viewsRequireLifecycle = viewsRequireLifecycle(viewFactory);
        return _this;
    }
    Repeat.prototype.call = function (context, changes) {
        this[context](this.items, changes);
    };
    Repeat.prototype.bind = function (bindingContext, overrideContext) {
        this.scope = { bindingContext: bindingContext, overrideContext: overrideContext };
        this.matcherBinding = this._captureAndRemoveMatcherBinding();
        this.itemsChanged();
    };
    Repeat.prototype.unbind = function () {
        this.scope = null;
        this.items = null;
        this.matcherBinding = null;
        this.viewSlot.removeAll(true, true);
        this._unsubscribeCollection();
    };
    Repeat.prototype._unsubscribeCollection = function () {
        if (this.collectionObserver) {
            this.collectionObserver.unsubscribe(this.callContext, this);
            this.collectionObserver = null;
            this.callContext = null;
        }
    };
    Repeat.prototype.itemsChanged = function () {
        var _this = this;
        this._unsubscribeCollection();
        if (!this.scope) {
            return;
        }
        var items = this.items;
        this.strategy = this.strategyLocator.getStrategy(items);
        if (!this.strategy) {
            throw new Error("Value for '" + this.sourceExpression + "' is non-repeatable");
        }
        if (!this.isOneTime && !this._observeInnerCollection()) {
            this._observeCollection();
        }
        this.ignoreMutation = true;
        this.strategy.instanceChanged(this, items);
        this.observerLocator.taskQueue.queueMicroTask(function () {
            _this.ignoreMutation = false;
        });
    };
    Repeat.prototype._getInnerCollection = function () {
        var expression = unwrapExpression(this.sourceExpression);
        if (!expression) {
            return null;
        }
        return expression.evaluate(this.scope, null);
    };
    Repeat.prototype.handleCollectionMutated = function (collection, changes) {
        if (!this.collectionObserver) {
            return;
        }
        if (this.ignoreMutation) {
            return;
        }
        this.strategy.instanceMutated(this, collection, changes);
    };
    Repeat.prototype.handleInnerCollectionMutated = function (collection, changes) {
        var _this = this;
        if (!this.collectionObserver) {
            return;
        }
        if (this.ignoreMutation) {
            return;
        }
        this.ignoreMutation = true;
        var newItems = this.sourceExpression.evaluate(this.scope, this.lookupFunctions);
        this.observerLocator.taskQueue.queueMicroTask(function () { return _this.ignoreMutation = false; });
        if (newItems === this.items) {
            this.itemsChanged();
        }
        else {
            this.items = newItems;
        }
    };
    Repeat.prototype._observeInnerCollection = function () {
        var items = this._getInnerCollection();
        var strategy = this.strategyLocator.getStrategy(items);
        if (!strategy) {
            return false;
        }
        this.collectionObserver = strategy.getCollectionObserver(this.observerLocator, items);
        if (!this.collectionObserver) {
            return false;
        }
        this.callContext = 'handleInnerCollectionMutated';
        this.collectionObserver.subscribe(this.callContext, this);
        return true;
    };
    Repeat.prototype._observeCollection = function () {
        var items = this.items;
        this.collectionObserver = this.strategy.getCollectionObserver(this.observerLocator, items);
        if (this.collectionObserver) {
            this.callContext = 'handleCollectionMutated';
            this.collectionObserver.subscribe(this.callContext, this);
        }
    };
    Repeat.prototype._captureAndRemoveMatcherBinding = function () {
        if (this.viewFactory.viewFactory) {
            var instructions = this.viewFactory.viewFactory.instructions;
            var instructionIds = Object.keys(instructions);
            for (var i = 0; i < instructionIds.length; i++) {
                var expressions = instructions[instructionIds[i]].expressions;
                if (expressions) {
                    for (var ii = 0; ii < expressions.length; ii++) {
                        if (expressions[ii].targetProperty === 'matcher') {
                            var matcherBinding = expressions[ii];
                            expressions.splice(ii, 1);
                            return matcherBinding;
                        }
                    }
                }
            }
        }
        return undefined;
    };
    Repeat.prototype.viewCount = function () { return this.viewSlot.children.length; };
    Repeat.prototype.views = function () { return this.viewSlot.children; };
    Repeat.prototype.view = function (index) { return this.viewSlot.children[index]; };
    Repeat.prototype.matcher = function () { return this.matcherBinding ? this.matcherBinding.sourceExpression.evaluate(this.scope, this.matcherBinding.lookupFunctions) : null; };
    Repeat.prototype.addView = function (bindingContext, overrideContext) {
        var view = this.viewFactory.create();
        view.bind(bindingContext, overrideContext);
        this.viewSlot.add(view);
    };
    Repeat.prototype.insertView = function (index, bindingContext, overrideContext) {
        var view = this.viewFactory.create();
        view.bind(bindingContext, overrideContext);
        this.viewSlot.insert(index, view);
    };
    Repeat.prototype.moveView = function (sourceIndex, targetIndex) {
        this.viewSlot.move(sourceIndex, targetIndex);
    };
    Repeat.prototype.removeAllViews = function (returnToCache, skipAnimation) {
        return this.viewSlot.removeAll(returnToCache, skipAnimation);
    };
    Repeat.prototype.removeViews = function (viewsToRemove, returnToCache, skipAnimation) {
        return this.viewSlot.removeMany(viewsToRemove, returnToCache, skipAnimation);
    };
    Repeat.prototype.removeView = function (index, returnToCache, skipAnimation) {
        return this.viewSlot.removeAt(index, returnToCache, skipAnimation);
    };
    Repeat.prototype.updateBindings = function (view) {
        var $view = view;
        var j = $view.bindings.length;
        while (j--) {
            updateOneTimeBinding($view.bindings[j]);
        }
        j = $view.controllers.length;
        while (j--) {
            var k = $view.controllers[j].boundProperties.length;
            while (k--) {
                var binding = $view.controllers[j].boundProperties[k].binding;
                updateOneTimeBinding(binding);
            }
        }
    };
    __decorate([
        bindable
    ], Repeat.prototype, "items", void 0);
    __decorate([
        bindable
    ], Repeat.prototype, "local", void 0);
    __decorate([
        bindable
    ], Repeat.prototype, "key", void 0);
    __decorate([
        bindable
    ], Repeat.prototype, "value", void 0);
    Repeat = __decorate([
        customAttribute('repeat'),
        templateController,
        inject(BoundViewFactory, TargetInstruction, ViewSlot, ViewResources, ObserverLocator, RepeatStrategyLocator)
    ], Repeat);
    return Repeat;
}(AbstractRepeater));

var aureliaHideClassName = 'aurelia-hide';
var aureliaHideClass = "." + aureliaHideClassName + " { display:none !important; }";
function injectAureliaHideStyleAtHead() {
    DOM.injectStyles(aureliaHideClass);
}
function injectAureliaHideStyleAtBoundary(domBoundary) {
    if (FEATURE.shadowDOM && domBoundary && !domBoundary.hasAureliaHideStyle) {
        domBoundary.hasAureliaHideStyle = true;
        DOM.injectStyles(aureliaHideClass, domBoundary);
    }
}

var Show = (function () {
    function Show(element, animator, domBoundary) {
        this.element = element;
        this.animator = animator;
        this.domBoundary = domBoundary;
    }
    Show.inject = function () {
        return [DOM.Element, Animator, Optional.of(DOM.boundary, true)];
    };
    Show.prototype.created = function () {
        injectAureliaHideStyleAtBoundary(this.domBoundary);
    };
    Show.prototype.valueChanged = function (newValue) {
        var element = this.element;
        var animator = this.animator;
        if (newValue) {
            animator.removeClass(element, aureliaHideClassName);
        }
        else {
            animator.addClass(element, aureliaHideClassName);
        }
    };
    Show.prototype.bind = function (bindingContext) {
        this.valueChanged(this.value);
    };
    Show = __decorate([
        customAttribute('show')
    ], Show);
    return Show;
}());

var Hide = (function () {
    function Hide(element, animator, domBoundary) {
        this.element = element;
        this.animator = animator;
        this.domBoundary = domBoundary;
    }
    Hide.inject = function () {
        return [DOM.Element, Animator, Optional.of(DOM.boundary, true)];
    };
    Hide.prototype.created = function () {
        injectAureliaHideStyleAtBoundary(this.domBoundary);
    };
    Hide.prototype.valueChanged = function (newValue) {
        if (newValue) {
            this.animator.addClass(this.element, aureliaHideClassName);
        }
        else {
            this.animator.removeClass(this.element, aureliaHideClassName);
        }
    };
    Hide.prototype.bind = function (bindingContext) {
        this.valueChanged(this.value);
    };
    Hide.prototype.value = function (value) {
        throw new Error('Method not implemented.');
    };
    Hide = __decorate([
        customAttribute('hide')
    ], Hide);
    return Hide;
}());

var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
var needsToWarn = true;
var HTMLSanitizer = (function () {
    function HTMLSanitizer() {
    }
    HTMLSanitizer.prototype.sanitize = function (input) {
        if (needsToWarn) {
            needsToWarn = false;
            getLogger('html-sanitizer')
                .warn("CAUTION: The default HTMLSanitizer does NOT provide security against a wide variety of sophisticated XSS attacks,\nand should not be relied on for sanitizing input from unknown sources.\nPlease see https://aurelia.io/docs/binding/basics#element-content for instructions on how to use a secure solution like DOMPurify or sanitize-html.");
        }
        return input.replace(SCRIPT_REGEX, '');
    };
    return HTMLSanitizer;
}());

var SanitizeHTMLValueConverter = (function () {
    function SanitizeHTMLValueConverter(sanitizer) {
        this.sanitizer = sanitizer;
    }
    SanitizeHTMLValueConverter.prototype.toView = function (untrustedMarkup) {
        if (untrustedMarkup === null || untrustedMarkup === undefined) {
            return null;
        }
        return this.sanitizer.sanitize(untrustedMarkup);
    };
    SanitizeHTMLValueConverter = __decorate([
        valueConverter('sanitizeHTML'),
        inject(HTMLSanitizer)
    ], SanitizeHTMLValueConverter);
    return SanitizeHTMLValueConverter;
}());

var Replaceable = (function () {
    function Replaceable(viewFactory, viewSlot) {
        this.viewFactory = viewFactory;
        this.viewSlot = viewSlot;
        this.view = null;
    }
    Replaceable.prototype.bind = function (bindingContext, overrideContext) {
        if (this.view === null) {
            this.view = this.viewFactory.create();
            this.viewSlot.add(this.view);
        }
        this.view.bind(bindingContext, overrideContext);
    };
    Replaceable.prototype.unbind = function () {
        this.view.unbind();
    };
    Replaceable = __decorate([
        customAttribute('replaceable'),
        templateController,
        inject(BoundViewFactory, ViewSlot)
    ], Replaceable);
    return Replaceable;
}());

var Focus = (function () {
    function Focus(element, taskQueue) {
        this.element = element;
        this.taskQueue = taskQueue;
        this.isAttached = false;
        this.needsApply = false;
    }
    Focus.inject = function () {
        return [DOM.Element, TaskQueue];
    };
    Focus.prototype.valueChanged = function (newValue) {
        if (this.isAttached) {
            this._apply();
        }
        else {
            this.needsApply = true;
        }
    };
    Focus.prototype._apply = function () {
        var _this = this;
        if (this.value) {
            this.taskQueue.queueMicroTask(function () {
                if (_this.value) {
                    _this.element.focus();
                }
            });
        }
        else {
            this.element.blur();
        }
    };
    Focus.prototype.attached = function () {
        this.isAttached = true;
        if (this.needsApply) {
            this.needsApply = false;
            this._apply();
        }
        this.element.addEventListener('focus', this);
        this.element.addEventListener('blur', this);
    };
    Focus.prototype.detached = function () {
        this.isAttached = false;
        this.element.removeEventListener('focus', this);
        this.element.removeEventListener('blur', this);
    };
    Focus.prototype.handleEvent = function (e) {
        if (e.type === 'focus') {
            this.value = true;
        }
        else if (DOM.activeElement !== this.element) {
            this.value = false;
        }
    };
    Focus = __decorate([
        customAttribute('focus', bindingMode.twoWay)
    ], Focus);
    return Focus;
}());

var cssUrlMatcher = /url\((?!['"]data)([^)]+)\)/gi;
function fixupCSSUrls(address, css) {
    if (typeof css !== 'string') {
        throw new Error("Failed loading required CSS file: " + address);
    }
    return css.replace(cssUrlMatcher, function (match, p1) {
        var quote = p1.charAt(0);
        if (quote === '\'' || quote === '"') {
            p1 = p1.substr(1, p1.length - 2);
        }
        return 'url(\'' + relativeToFile(p1, address) + '\')';
    });
}
var CSSResource = (function () {
    function CSSResource(address) {
        this.address = address;
        this._scoped = null;
        this._global = false;
        this._alreadyGloballyInjected = false;
    }
    CSSResource.prototype.initialize = function (container, Target) {
        this._scoped = new Target(this);
    };
    CSSResource.prototype.register = function (registry, name) {
        if (name === 'scoped') {
            registry.registerViewEngineHooks(this._scoped);
        }
        else {
            this._global = true;
        }
    };
    CSSResource.prototype.load = function (container) {
        var _this = this;
        return container.get(Loader)
            .loadText(this.address)
            .catch(function (err) { return null; })
            .then(function (text) {
            text = fixupCSSUrls(_this.address, text);
            _this._scoped.css = text;
            if (_this._global) {
                _this._alreadyGloballyInjected = true;
                DOM.injectStyles(text);
            }
        });
    };
    return CSSResource;
}());
var CSSViewEngineHooks = (function () {
    function CSSViewEngineHooks(owner) {
        this.owner = owner;
        this.css = null;
    }
    CSSViewEngineHooks.prototype.beforeCompile = function (content, resources, instruction) {
        if (instruction.targetShadowDOM) {
            DOM.injectStyles(this.css, content, true);
        }
        else if (FEATURE.scopedCSS) {
            var styleNode = DOM.injectStyles(this.css, content, true);
            styleNode.setAttribute('scoped', 'scoped');
        }
        else if (this._global && !this.owner._alreadyGloballyInjected) {
            DOM.injectStyles(this.css);
            this.owner._alreadyGloballyInjected = true;
        }
    };
    return CSSViewEngineHooks;
}());
function _createCSSResource(address) {
    var ViewCSS = (function (_super) {
        __extends(ViewCSS, _super);
        function ViewCSS() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ViewCSS = __decorate([
            resource(new CSSResource(address))
        ], ViewCSS);
        return ViewCSS;
    }(CSSViewEngineHooks));
    return ViewCSS;
}

var AttrBindingBehavior = (function () {
    function AttrBindingBehavior() {
    }
    AttrBindingBehavior.prototype.bind = function (binding, source) {
        binding.targetObserver = new DataAttributeObserver(binding.target, binding.targetProperty);
    };
    AttrBindingBehavior.prototype.unbind = function (binding, source) {
    };
    AttrBindingBehavior = __decorate([
        bindingBehavior('attr')
    ], AttrBindingBehavior);
    return AttrBindingBehavior;
}());

var modeBindingBehavior = {
    bind: function (binding, source, lookupFunctions) {
        binding.originalMode = binding.mode;
        binding.mode = this.mode;
    },
    unbind: function (binding, source) {
        binding.mode = binding.originalMode;
        binding.originalMode = null;
    }
};
var OneTimeBindingBehavior = (function () {
    function OneTimeBindingBehavior() {
        this.mode = bindingMode.oneTime;
    }
    OneTimeBindingBehavior = __decorate([
        mixin(modeBindingBehavior),
        bindingBehavior('oneTime')
    ], OneTimeBindingBehavior);
    return OneTimeBindingBehavior;
}());
var OneWayBindingBehavior = (function () {
    function OneWayBindingBehavior() {
        this.mode = bindingMode.toView;
    }
    OneWayBindingBehavior = __decorate([
        mixin(modeBindingBehavior),
        bindingBehavior('oneWay')
    ], OneWayBindingBehavior);
    return OneWayBindingBehavior;
}());
var ToViewBindingBehavior = (function () {
    function ToViewBindingBehavior() {
        this.mode = bindingMode.toView;
    }
    ToViewBindingBehavior = __decorate([
        mixin(modeBindingBehavior),
        bindingBehavior('toView')
    ], ToViewBindingBehavior);
    return ToViewBindingBehavior;
}());
var FromViewBindingBehavior = (function () {
    function FromViewBindingBehavior() {
        this.mode = bindingMode.fromView;
    }
    FromViewBindingBehavior = __decorate([
        mixin(modeBindingBehavior),
        bindingBehavior('fromView')
    ], FromViewBindingBehavior);
    return FromViewBindingBehavior;
}());
var TwoWayBindingBehavior = (function () {
    function TwoWayBindingBehavior() {
        this.mode = bindingMode.twoWay;
    }
    TwoWayBindingBehavior = __decorate([
        mixin(modeBindingBehavior),
        bindingBehavior('twoWay')
    ], TwoWayBindingBehavior);
    return TwoWayBindingBehavior;
}());

function throttle(newValue) {
    var _this = this;
    var state = this.throttleState;
    var elapsed = +new Date() - state.last;
    if (elapsed >= state.delay) {
        clearTimeout(state.timeoutId);
        state.timeoutId = null;
        state.last = +new Date();
        this.throttledMethod(newValue);
        return;
    }
    state.newValue = newValue;
    if (state.timeoutId === null) {
        state.timeoutId = setTimeout(function () {
            state.timeoutId = null;
            state.last = +new Date();
            _this.throttledMethod(state.newValue);
        }, state.delay - elapsed);
    }
}
var ThrottleBindingBehavior = (function () {
    function ThrottleBindingBehavior() {
    }
    ThrottleBindingBehavior.prototype.bind = function (binding, source, delay) {
        if (delay === void 0) { delay = 200; }
        var methodToThrottle = 'updateTarget';
        if (binding.callSource) {
            methodToThrottle = 'callSource';
        }
        else if (binding.updateSource && binding.mode === bindingMode.twoWay) {
            methodToThrottle = 'updateSource';
        }
        binding.throttledMethod = binding[methodToThrottle];
        binding.throttledMethod.originalName = methodToThrottle;
        binding[methodToThrottle] = throttle;
        binding.throttleState = {
            delay: delay,
            last: 0,
            timeoutId: null
        };
    };
    ThrottleBindingBehavior.prototype.unbind = function (binding, source) {
        var methodToRestore = binding.throttledMethod.originalName;
        binding[methodToRestore] = binding.throttledMethod;
        binding.throttledMethod = null;
        clearTimeout(binding.throttleState.timeoutId);
        binding.throttleState = null;
    };
    ThrottleBindingBehavior = __decorate([
        bindingBehavior('throttle')
    ], ThrottleBindingBehavior);
    return ThrottleBindingBehavior;
}());

var unset = {};
function debounceCallSource(event) {
    var _this = this;
    var state = this.debounceState;
    clearTimeout(state.timeoutId);
    state.timeoutId = setTimeout(function () { return _this.debouncedMethod(event); }, state.delay);
}
function debounceCall(context, newValue, oldValue) {
    var _this = this;
    var state = this.debounceState;
    clearTimeout(state.timeoutId);
    if (context !== state.callContextToDebounce) {
        state.oldValue = unset;
        this.debouncedMethod(context, newValue, oldValue);
        return;
    }
    if (state.oldValue === unset) {
        state.oldValue = oldValue;
    }
    state.timeoutId = setTimeout(function () {
        var _oldValue = state.oldValue;
        state.oldValue = unset;
        _this.debouncedMethod(context, newValue, _oldValue);
    }, state.delay);
}
var DebounceBindingBehavior = (function () {
    function DebounceBindingBehavior() {
    }
    DebounceBindingBehavior.prototype.bind = function (binding, source, delay) {
        if (delay === void 0) { delay = 200; }
        var isCallSource = binding.callSource !== undefined;
        var methodToDebounce = isCallSource ? 'callSource' : 'call';
        var debouncer = isCallSource ? debounceCallSource : debounceCall;
        var mode = binding.mode;
        var callContextToDebounce = mode === bindingMode.twoWay || mode === bindingMode.fromView ? targetContext : sourceContext;
        binding.debouncedMethod = binding[methodToDebounce];
        binding.debouncedMethod.originalName = methodToDebounce;
        binding[methodToDebounce] = debouncer;
        binding.debounceState = {
            callContextToDebounce: callContextToDebounce,
            delay: delay,
            timeoutId: 0,
            oldValue: unset
        };
    };
    DebounceBindingBehavior.prototype.unbind = function (binding, source) {
        var methodToRestore = binding.debouncedMethod.originalName;
        binding[methodToRestore] = binding.debouncedMethod;
        binding.debouncedMethod = null;
        clearTimeout(binding.debounceState.timeoutId);
        binding.debounceState = null;
    };
    DebounceBindingBehavior = __decorate([
        bindingBehavior('debounce')
    ], DebounceBindingBehavior);
    return DebounceBindingBehavior;
}());

function findOriginalEventTarget(event) {
    return (event.path && event.path[0]) || (event.deepPath && event.deepPath[0]) || event.target;
}
function handleSelfEvent(event) {
    var target = findOriginalEventTarget(event);
    if (this.target !== target) {
        return;
    }
    this.selfEventCallSource(event);
}
var SelfBindingBehavior = (function () {
    function SelfBindingBehavior() {
    }
    SelfBindingBehavior.prototype.bind = function (binding, source) {
        if (!binding.callSource || !binding.targetEvent) {
            throw new Error('Self binding behavior only supports event.');
        }
        binding.selfEventCallSource = binding.callSource;
        binding.callSource = handleSelfEvent;
    };
    SelfBindingBehavior.prototype.unbind = function (binding, source) {
        binding.callSource = binding.selfEventCallSource;
        binding.selfEventCallSource = null;
    };
    SelfBindingBehavior = __decorate([
        bindingBehavior('self')
    ], SelfBindingBehavior);
    return SelfBindingBehavior;
}());

var BindingSignaler = (function () {
    function BindingSignaler() {
        this.signals = {};
    }
    BindingSignaler.prototype.signal = function (name) {
        var bindings = this.signals[name];
        if (!bindings) {
            return;
        }
        var i = bindings.length;
        while (i--) {
            bindings[i].call(sourceContext);
        }
    };
    return BindingSignaler;
}());

var SignalBindingBehavior = (function () {
    function SignalBindingBehavior(bindingSignaler) {
        this.signals = bindingSignaler.signals;
    }
    SignalBindingBehavior.inject = function () { return [BindingSignaler]; };
    SignalBindingBehavior.prototype.bind = function (binding, source) {
        var names = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            names[_i - 2] = arguments[_i];
        }
        if (!binding.updateTarget) {
            throw new Error('Only property bindings and string interpolation bindings can be signaled.  Trigger, delegate and call bindings cannot be signaled.');
        }
        var signals = this.signals;
        if (names.length === 1) {
            var name_1 = names[0];
            var bindings = signals[name_1] || (signals[name_1] = []);
            bindings.push(binding);
            binding.signalName = name_1;
        }
        else if (names.length > 1) {
            var i = names.length;
            while (i--) {
                var name_2 = names[i];
                var bindings = signals[name_2] || (signals[name_2] = []);
                bindings.push(binding);
            }
            binding.signalName = names;
        }
        else {
            throw new Error('Signal name is required.');
        }
    };
    SignalBindingBehavior.prototype.unbind = function (binding, source) {
        var signals = this.signals;
        var name = binding.signalName;
        binding.signalName = null;
        if (Array.isArray(name)) {
            var names = name;
            var i = names.length;
            while (i--) {
                var n = names[i];
                var bindings = signals[n];
                bindings.splice(bindings.indexOf(binding), 1);
            }
        }
        else {
            var bindings = signals[name];
            bindings.splice(bindings.indexOf(binding), 1);
        }
    };
    SignalBindingBehavior = __decorate([
        bindingBehavior('signal')
    ], SignalBindingBehavior);
    return SignalBindingBehavior;
}());

var eventNamesRequired = 'The updateTrigger binding behavior requires at least one event name argument: eg <input value.bind="firstName & updateTrigger:\'blur\'">';
var notApplicableMessage = 'The updateTrigger binding behavior can only be applied to two-way/ from-view bindings on input/select elements.';
var UpdateTriggerBindingBehavior = (function () {
    function UpdateTriggerBindingBehavior() {
    }
    UpdateTriggerBindingBehavior.prototype.bind = function (binding, source) {
        var events = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            events[_i - 2] = arguments[_i];
        }
        if (events.length === 0) {
            throw new Error(eventNamesRequired);
        }
        if (binding.mode !== bindingMode.twoWay && binding.mode !== bindingMode.fromView) {
            throw new Error(notApplicableMessage);
        }
        var targetObserver = binding.observerLocator.getObserver(binding.target, binding.targetProperty);
        if (!targetObserver.handler) {
            throw new Error(notApplicableMessage);
        }
        binding.targetObserver = targetObserver;
        targetObserver.originalHandler = binding.targetObserver.handler;
        var handler = new EventSubscriber(events);
        targetObserver.handler = handler;
    };
    UpdateTriggerBindingBehavior.prototype.unbind = function (binding, source) {
        var targetObserver = binding.targetObserver;
        targetObserver.handler.dispose();
        targetObserver.handler = targetObserver.originalHandler;
        targetObserver.originalHandler = null;
    };
    UpdateTriggerBindingBehavior = __decorate([
        bindingBehavior('updateTrigger')
    ], UpdateTriggerBindingBehavior);
    return UpdateTriggerBindingBehavior;
}());

function _createDynamicElement(_a) {
    var name = _a.name, viewUrl = _a.viewUrl, bindableNames = _a.bindableNames, useShadowDOMmode = _a.useShadowDOMmode;
    var DynamicElement = (function () {
        function DynamicElement() {
        }
        DynamicElement.prototype.bind = function (bindingContext) {
            this.$parent = bindingContext;
        };
        DynamicElement = __decorate([
            customElement(name),
            useView(viewUrl)
        ], DynamicElement);
        return DynamicElement;
    }());
    for (var i = 0, ii = bindableNames.length; i < ii; ++i) {
        bindable(bindableNames[i])(DynamicElement);
    }
    switch (useShadowDOMmode) {
        case 'open':
            useShadowDOM({ mode: 'open' })(DynamicElement);
            break;
        case 'closed':
            useShadowDOM({ mode: 'closed' })(DynamicElement);
            break;
        case '':
            useShadowDOM(DynamicElement);
            break;
        case null:
            break;
        default:
            getLogger('aurelia-html-only-element')
                .warn("Expected 'use-shadow-dom' value to be \"close\", \"open\" or \"\", received " + useShadowDOMmode);
            break;
    }
    return DynamicElement;
}

function getElementName(address) {
    return /([^\/^\?]+)\.html/i.exec(address)[1].toLowerCase();
}
function configure(config) {
    var viewEngine = config.container.get(ViewEngine);
    var loader = config.aurelia.loader;
    viewEngine.addResourcePlugin('.html', {
        'fetch': function (viewUrl) {
            return loader.loadTemplate(viewUrl).then(function (registryEntry) {
                var _a;
                var bindableNames = registryEntry.template.getAttribute('bindable');
                var useShadowDOMmode = registryEntry.template.getAttribute('use-shadow-dom');
                var name = getElementName(viewUrl);
                if (bindableNames) {
                    bindableNames = bindableNames.split(',').map(function (x) { return x.trim(); });
                    registryEntry.template.removeAttribute('bindable');
                }
                else {
                    bindableNames = [];
                }
                return _a = {}, _a[name] = _createDynamicElement({ name: name, viewUrl: viewUrl, bindableNames: bindableNames, useShadowDOMmode: useShadowDOMmode }), _a;
            });
        }
    });
}

function configure$1(config) {
    injectAureliaHideStyleAtHead();
    config.globalResources(Compose, If, Else, With, Repeat, Show, Hide, Replaceable, Focus, SanitizeHTMLValueConverter, OneTimeBindingBehavior, OneWayBindingBehavior, ToViewBindingBehavior, FromViewBindingBehavior, TwoWayBindingBehavior, ThrottleBindingBehavior, DebounceBindingBehavior, SelfBindingBehavior, SignalBindingBehavior, UpdateTriggerBindingBehavior, AttrBindingBehavior);
    configure(config);
    var viewEngine = config.container.get(ViewEngine);
    var styleResourcePlugin = {
        fetch: function (address) {
            var _a;
            return _a = {}, _a[address] = _createCSSResource(address), _a;
        }
    };
    ['.css', '.less', '.sass', '.scss', '.styl'].forEach(function (ext) { return viewEngine.addResourcePlugin(ext, styleResourcePlugin); });
}

export { AbstractRepeater, ArrayRepeatStrategy, AttrBindingBehavior, BindingSignaler, Compose, DebounceBindingBehavior, Else, Focus, FromViewBindingBehavior, HTMLSanitizer, Hide, If, MapRepeatStrategy, NullRepeatStrategy, NumberRepeatStrategy, OneTimeBindingBehavior, OneWayBindingBehavior, Repeat, RepeatStrategyLocator, Replaceable, SanitizeHTMLValueConverter, SelfBindingBehavior, SetRepeatStrategy, Show, SignalBindingBehavior, ThrottleBindingBehavior, ToViewBindingBehavior, TwoWayBindingBehavior, UpdateTriggerBindingBehavior, With, configure$1 as configure, createFullOverrideContext, getItemsSourceExpression, isOneTime, unwrapExpression, updateOneTimeBinding, updateOverrideContext, viewsRequireLifecycle };
//# sourceMappingURL=aurelia-templating-resources.js.map
