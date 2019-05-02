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

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

let Compose = class Compose {
    constructor(element, container, compositionEngine, viewSlot, viewResources, taskQueue) {
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
    static inject() {
        return [DOM.Element, Container, CompositionEngine, ViewSlot, ViewResources, TaskQueue];
    }
    created(owningView) {
        this.owningView = owningView;
    }
    bind(bindingContext, overrideContext) {
        this.bindingContext = bindingContext;
        this.overrideContext = overrideContext;
        let changes = this.changes;
        changes.view = this.view;
        changes.viewModel = this.viewModel;
        changes.model = this.model;
        if (!this.pendingTask) {
            processChanges(this);
        }
    }
    unbind() {
        this.changes = Object.create(null);
        this.bindingContext = null;
        this.overrideContext = null;
        let returnToCache = true;
        let skipAnimation = true;
        this.viewSlot.removeAll(returnToCache, skipAnimation);
    }
    modelChanged(newValue, oldValue) {
        this.changes.model = newValue;
        requestUpdate(this);
    }
    viewChanged(newValue, oldValue) {
        this.changes.view = newValue;
        requestUpdate(this);
    }
    viewModelChanged(newValue, oldValue) {
        this.changes.viewModel = newValue;
        requestUpdate(this);
    }
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
function isEmpty(obj) {
    for (const _ in obj) {
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
    const changes = composer.changes;
    composer.changes = Object.create(null);
    if (!('view' in changes) && !('viewModel' in changes) && ('model' in changes)) {
        composer.pendingTask = tryActivateViewModel(composer.currentViewModel, changes.model);
        if (!composer.pendingTask) {
            return;
        }
    }
    else {
        let instruction = {
            view: composer.view,
            viewModel: composer.currentViewModel || composer.viewModel,
            model: composer.model
        };
        instruction = Object.assign(instruction, changes);
        instruction = createInstruction(composer, instruction);
        composer.pendingTask = composer.compositionEngine.compose(instruction).then(controller => {
            composer.currentController = controller;
            composer.currentViewModel = controller ? controller.viewModel : null;
        });
    }
    composer.pendingTask = composer.pendingTask
        .then(() => {
        completeCompositionTask(composer);
    }, reason => {
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
    composer.taskQueue.queueMicroTask(() => {
        composer.updateRequested = false;
        processChanges(composer);
    });
}

class IfCore {
    constructor(viewFactory, viewSlot) {
        this.viewFactory = viewFactory;
        this.viewSlot = viewSlot;
        this.view = null;
        this.bindingContext = null;
        this.overrideContext = null;
        this.showing = false;
        this.cache = true;
    }
    bind(bindingContext, overrideContext) {
        this.bindingContext = bindingContext;
        this.overrideContext = overrideContext;
    }
    unbind() {
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
    }
    _show() {
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
    }
    _hide() {
        if (!this.showing) {
            return;
        }
        this.showing = false;
        let removed = this.viewSlot.remove(this.view);
        if (removed instanceof Promise) {
            return removed.then(() => {
                this._unbindView();
            });
        }
        this._unbindView();
    }
    _unbindView() {
        const cache = this.cache === 'false' ? false : !!this.cache;
        this.view.unbind();
        if (!cache) {
            this.view = null;
        }
    }
}

let If = class If extends IfCore {
    constructor() {
        super(...arguments);
        this.cache = true;
    }
    bind(bindingContext, overrideContext) {
        super.bind(bindingContext, overrideContext);
        if (this.condition) {
            this._show();
        }
        else {
            this._hide();
        }
    }
    conditionChanged(newValue) {
        this._update(newValue);
    }
    _update(show) {
        if (this.animating) {
            return;
        }
        let promise;
        if (this.elseVm) {
            promise = show ? this._swap(this.elseVm, this) : this._swap(this, this.elseVm);
        }
        else {
            promise = show ? this._show() : this._hide();
        }
        if (promise) {
            this.animating = true;
            promise.then(() => {
                this.animating = false;
                if (this.condition !== this.showing) {
                    this._update(this.condition);
                }
            });
        }
    }
    _swap(remove, add) {
        switch (this.swapOrder) {
            case 'before':
                return Promise.resolve(add._show()).then(() => remove._hide());
            case 'with':
                return Promise.all([remove._hide(), add._show()]);
            default:
                let promise = remove._hide();
                return promise ? promise.then(() => add._show()) : add._show();
        }
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

let Else = class Else extends IfCore {
    constructor(viewFactory, viewSlot) {
        super(viewFactory, viewSlot);
        this._registerInIf();
    }
    bind(bindingContext, overrideContext) {
        super.bind(bindingContext, overrideContext);
        if (this.ifVm.condition) {
            this._hide();
        }
        else {
            this._show();
        }
    }
    _registerInIf() {
        let previous = this.viewSlot.anchor.previousSibling;
        while (previous && !previous.au) {
            previous = previous.previousSibling;
        }
        if (!previous || !previous.au.if) {
            throw new Error("Can't find matching If for Else custom attribute.");
        }
        this.ifVm = previous.au.if.viewModel;
        this.ifVm.elseVm = this;
    }
};
Else = __decorate([
    customAttribute('else'),
    templateController,
    inject(BoundViewFactory, ViewSlot)
], Else);

let With = class With {
    constructor(viewFactory, viewSlot) {
        this.viewFactory = viewFactory;
        this.viewSlot = viewSlot;
        this.parentOverrideContext = null;
        this.view = null;
    }
    bind(bindingContext, overrideContext) {
        this.parentOverrideContext = overrideContext;
        this.valueChanged(this.value);
    }
    valueChanged(newValue) {
        let overrideContext = createOverrideContext(newValue, this.parentOverrideContext);
        let view = this.view;
        if (!view) {
            view = this.view = this.viewFactory.create();
            view.bind(newValue, overrideContext);
            this.viewSlot.add(view);
        }
        else {
            view.bind(newValue, overrideContext);
        }
    }
    unbind() {
        let view = this.view;
        this.parentOverrideContext = null;
        if (view) {
            view.unbind();
        }
    }
};
With = __decorate([
    customAttribute('with'),
    templateController,
    inject(BoundViewFactory, ViewSlot)
], With);

const oneTime = bindingMode.oneTime;
function updateOverrideContexts(views, startIndex) {
    let length = views.length;
    if (startIndex > 0) {
        startIndex = startIndex - 1;
    }
    for (; startIndex < length; ++startIndex) {
        updateOverrideContext(views[startIndex].overrideContext, startIndex, length);
    }
}
function createFullOverrideContext(repeat, data, index, length, key) {
    let bindingContext = {};
    let overrideContext = createOverrideContext(bindingContext, repeat.scope.overrideContext);
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
function getItemsSourceExpression(instruction, attrName) {
    return instruction.behaviorInstructions
        .filter(bi => bi.originalAttrName === attrName)[0]
        .attributes
        .items
        .sourceExpression;
}
function unwrapExpression(expression) {
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
    const length = array.length;
    for (let index = startIndex || 0; index < length; index++) {
        if (matcher(array[index], item)) {
            return index;
        }
    }
    return -1;
}

class ArrayRepeatStrategy {
    getCollectionObserver(observerLocator, items) {
        return observerLocator.getArrayObserver(items);
    }
    instanceChanged(repeat, items) {
        const itemsLength = items.length;
        if (!items || itemsLength === 0) {
            repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
            return;
        }
        const children = repeat.views();
        const viewsLength = children.length;
        if (viewsLength === 0) {
            this._standardProcessInstanceChanged(repeat, items);
            return;
        }
        if (repeat.viewsRequireLifecycle) {
            const childrenSnapshot = children.slice(0);
            const itemNameInBindingContext = repeat.local;
            const matcher = repeat.matcher();
            let itemsPreviouslyInViews = [];
            const viewsToRemove = [];
            for (let index = 0; index < viewsLength; index++) {
                const view = childrenSnapshot[index];
                const oldItem = view.bindingContext[itemNameInBindingContext];
                if (indexOf(items, oldItem, matcher) === -1) {
                    viewsToRemove.push(view);
                }
                else {
                    itemsPreviouslyInViews.push(oldItem);
                }
            }
            let updateViews;
            let removePromise;
            if (itemsPreviouslyInViews.length > 0) {
                removePromise = repeat.removeViews(viewsToRemove, true, !repeat.viewsRequireLifecycle);
                updateViews = () => {
                    for (let index = 0; index < itemsLength; index++) {
                        const item = items[index];
                        const indexOfView = indexOf(itemsPreviouslyInViews, item, matcher, index);
                        let view;
                        if (indexOfView === -1) {
                            const overrideContext = createFullOverrideContext(repeat, items[index], index, itemsLength);
                            repeat.insertView(index, overrideContext.bindingContext, overrideContext);
                            itemsPreviouslyInViews.splice(index, 0, undefined);
                        }
                        else if (indexOfView === index) {
                            view = children[indexOfView];
                            itemsPreviouslyInViews[indexOfView] = undefined;
                        }
                        else {
                            view = children[indexOfView];
                            repeat.moveView(indexOfView, index);
                            itemsPreviouslyInViews.splice(indexOfView, 1);
                            itemsPreviouslyInViews.splice(index, 0, undefined);
                        }
                        if (view) {
                            updateOverrideContext(view.overrideContext, index, itemsLength);
                        }
                    }
                    this._inPlaceProcessItems(repeat, items);
                };
            }
            else {
                removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
                updateViews = () => this._standardProcessInstanceChanged(repeat, items);
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
    }
    _standardProcessInstanceChanged(repeat, items) {
        for (let i = 0, ii = items.length; i < ii; i++) {
            let overrideContext = createFullOverrideContext(repeat, items[i], i, ii);
            repeat.addView(overrideContext.bindingContext, overrideContext);
        }
    }
    _inPlaceProcessItems(repeat, items) {
        let itemsLength = items.length;
        let viewsLength = repeat.viewCount();
        while (viewsLength > itemsLength) {
            viewsLength--;
            repeat.removeView(viewsLength, true, !repeat.viewsRequireLifecycle);
        }
        let local = repeat.local;
        for (let i = 0; i < viewsLength; i++) {
            let view = repeat.view(i);
            let last = i === itemsLength - 1;
            let middle = i !== 0 && !last;
            let bindingContext = view.bindingContext;
            let overrideContext = view.overrideContext;
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
        for (let i = viewsLength; i < itemsLength; i++) {
            let overrideContext = createFullOverrideContext(repeat, items[i], i, itemsLength);
            repeat.addView(overrideContext.bindingContext, overrideContext);
        }
    }
    instanceMutated(repeat, array, splices) {
        if (repeat.__queuedSplices) {
            for (let i = 0, ii = splices.length; i < ii; ++i) {
                let { index, removed, addedCount } = splices[i];
                mergeSplice(repeat.__queuedSplices, index, removed, addedCount);
            }
            repeat.__array = array.slice(0);
            return;
        }
        let maybePromise = this._runSplices(repeat, array.slice(0), splices);
        if (maybePromise instanceof Promise) {
            let queuedSplices = repeat.__queuedSplices = [];
            let runQueuedSplices = () => {
                if (!queuedSplices.length) {
                    repeat.__queuedSplices = undefined;
                    repeat.__array = undefined;
                    return;
                }
                let nextPromise = this._runSplices(repeat, repeat.__array, queuedSplices) || Promise.resolve();
                queuedSplices = repeat.__queuedSplices = [];
                nextPromise.then(runQueuedSplices);
            };
            maybePromise.then(runQueuedSplices);
        }
    }
    _runSplices(repeat, array, splices) {
        let removeDelta = 0;
        let rmPromises = [];
        for (let i = 0, ii = splices.length; i < ii; ++i) {
            let splice = splices[i];
            let removed = splice.removed;
            for (let j = 0, jj = removed.length; j < jj; ++j) {
                let viewOrPromise = repeat.removeView(splice.index + removeDelta + rmPromises.length, true);
                if (viewOrPromise instanceof Promise) {
                    rmPromises.push(viewOrPromise);
                }
            }
            removeDelta -= splice.addedCount;
        }
        if (rmPromises.length > 0) {
            return Promise.all(rmPromises).then(() => {
                let spliceIndexLow = this._handleAddedSplices(repeat, array, splices);
                updateOverrideContexts(repeat.views(), spliceIndexLow);
            });
        }
        let spliceIndexLow = this._handleAddedSplices(repeat, array, splices);
        updateOverrideContexts(repeat.views(), spliceIndexLow);
        return undefined;
    }
    _handleAddedSplices(repeat, array, splices) {
        let spliceIndex;
        let spliceIndexLow;
        let arrayLength = array.length;
        for (let i = 0, ii = splices.length; i < ii; ++i) {
            let splice = splices[i];
            let addIndex = spliceIndex = splice.index;
            let end = splice.index + splice.addedCount;
            if (typeof spliceIndexLow === 'undefined' || spliceIndexLow === null || spliceIndexLow > splice.index) {
                spliceIndexLow = spliceIndex;
            }
            for (; addIndex < end; ++addIndex) {
                let overrideContext = createFullOverrideContext(repeat, array[addIndex], addIndex, arrayLength);
                repeat.insertView(addIndex, overrideContext.bindingContext, overrideContext);
            }
        }
        return spliceIndexLow;
    }
}

class MapRepeatStrategy {
    getCollectionObserver(observerLocator, items) {
        return observerLocator.getMapObserver(items);
    }
    instanceChanged(repeat, items) {
        let removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
        if (removePromise instanceof Promise) {
            removePromise.then(() => this._standardProcessItems(repeat, items));
            return;
        }
        this._standardProcessItems(repeat, items);
    }
    _standardProcessItems(repeat, items) {
        let index = 0;
        let overrideContext;
        items.forEach((value, key) => {
            overrideContext = createFullOverrideContext(repeat, value, index, items.size, key);
            repeat.addView(overrideContext.bindingContext, overrideContext);
            ++index;
        });
    }
    instanceMutated(repeat, map, records) {
        let key;
        let i;
        let ii;
        let overrideContext;
        let removeIndex;
        let addIndex;
        let record;
        let rmPromises = [];
        let viewOrPromise;
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
            Promise.all(rmPromises).then(() => {
                updateOverrideContexts(repeat.views(), 0);
            });
        }
        else {
            updateOverrideContexts(repeat.views(), 0);
        }
    }
    _getViewIndexByKey(repeat, key) {
        let i;
        let ii;
        let child;
        for (i = 0, ii = repeat.viewCount(); i < ii; ++i) {
            child = repeat.view(i);
            if (child.bindingContext[repeat.key] === key) {
                return i;
            }
        }
        return undefined;
    }
}

class NullRepeatStrategy {
    instanceChanged(repeat, items) {
        repeat.removeAllViews(true);
    }
    getCollectionObserver(observerLocator, items) {
    }
}

class NumberRepeatStrategy {
    getCollectionObserver() {
        return null;
    }
    instanceChanged(repeat, value) {
        let removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
        if (removePromise instanceof Promise) {
            removePromise.then(() => this._standardProcessItems(repeat, value));
            return;
        }
        this._standardProcessItems(repeat, value);
    }
    _standardProcessItems(repeat, value) {
        let childrenLength = repeat.viewCount();
        let i;
        let ii;
        let overrideContext;
        let viewsToRemove;
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
    }
}

class SetRepeatStrategy {
    getCollectionObserver(observerLocator, items) {
        return observerLocator.getSetObserver(items);
    }
    instanceChanged(repeat, items) {
        let removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
        if (removePromise instanceof Promise) {
            removePromise.then(() => this._standardProcessItems(repeat, items));
            return;
        }
        this._standardProcessItems(repeat, items);
    }
    _standardProcessItems(repeat, items) {
        let index = 0;
        let overrideContext;
        items.forEach(value => {
            overrideContext = createFullOverrideContext(repeat, value, index, items.size);
            repeat.addView(overrideContext.bindingContext, overrideContext);
            ++index;
        });
    }
    instanceMutated(repeat, set, records) {
        let value;
        let i;
        let ii;
        let overrideContext;
        let removeIndex;
        let record;
        let rmPromises = [];
        let viewOrPromise;
        for (i = 0, ii = records.length; i < ii; ++i) {
            record = records[i];
            value = record.value;
            switch (record.type) {
                case 'add':
                    let size = Math.max(set.size - 1, 0);
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
            Promise.all(rmPromises).then(() => {
                updateOverrideContexts(repeat.views(), 0);
            });
        }
        else {
            updateOverrideContexts(repeat.views(), 0);
        }
    }
    _getViewIndexByValue(repeat, value) {
        let i;
        let ii;
        let child;
        for (i = 0, ii = repeat.viewCount(); i < ii; ++i) {
            child = repeat.view(i);
            if (child.bindingContext[repeat.local] === value) {
                return i;
            }
        }
        return undefined;
    }
}

class RepeatStrategyLocator {
    constructor() {
        this.matchers = [];
        this.strategies = [];
        this.addStrategy(items => items === null || items === undefined, new NullRepeatStrategy());
        this.addStrategy(items => items instanceof Array, new ArrayRepeatStrategy());
        this.addStrategy(items => items instanceof Map, new MapRepeatStrategy());
        this.addStrategy(items => items instanceof Set, new SetRepeatStrategy());
        this.addStrategy(items => typeof items === 'number', new NumberRepeatStrategy());
    }
    addStrategy(matcher, strategy) {
        this.matchers.push(matcher);
        this.strategies.push(strategy);
    }
    getStrategy(items) {
        let matchers = this.matchers;
        for (let i = 0, ii = matchers.length; i < ii; ++i) {
            if (matchers[i](items)) {
                return this.strategies[i];
            }
        }
        return null;
    }
}

const lifecycleOptionalBehaviors = ['focus', 'if', 'else', 'repeat', 'show', 'hide', 'with'];
function behaviorRequiresLifecycle(instruction) {
    let t = instruction.type;
    let name = t.elementName !== null ? t.elementName : t.attributeName;
    return lifecycleOptionalBehaviors.indexOf(name) === -1 && (t.handlesAttached || t.handlesBind || t.handlesCreated || t.handlesDetached || t.handlesUnbind)
        || t.viewFactory && viewsRequireLifecycle(t.viewFactory)
        || instruction.viewFactory && viewsRequireLifecycle(instruction.viewFactory);
}
function targetRequiresLifecycle(instruction) {
    let behaviors = instruction.behaviorInstructions;
    if (behaviors) {
        let i = behaviors.length;
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
    for (let id in viewFactory.instructions) {
        if (targetRequiresLifecycle(viewFactory.instructions[id])) {
            viewFactory._viewsRequireLifecycle = true;
            return true;
        }
    }
    viewFactory._viewsRequireLifecycle = false;
    return false;
}

class AbstractRepeater {
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
    matcher() {
        throw new Error('subclass must implement `matcher`');
    }
    addView(bindingContext, overrideContext) {
        throw new Error('subclass must implement `addView`');
    }
    insertView(index, bindingContext, overrideContext) {
        throw new Error('subclass must implement `insertView`');
    }
    moveView(sourceIndex, targetIndex) {
        throw new Error('subclass must implement `moveView`');
    }
    removeAllViews(returnToCache, skipAnimation) {
        throw new Error('subclass must implement `removeAllViews`');
    }
    removeViews(viewsToRemove, returnToCache, skipAnimation) {
        throw new Error('subclass must implement `removeView`');
    }
    removeView(index, returnToCache, skipAnimation) {
        throw new Error('subclass must implement `removeView`');
    }
    updateBindings(view) {
        throw new Error('subclass must implement `updateBindings`');
    }
}

let Repeat = class Repeat extends AbstractRepeater {
    constructor(viewFactory, instruction, viewSlot, viewResources, observerLocator, strategyLocator) {
        super({
            local: 'item',
            viewsRequireLifecycle: viewsRequireLifecycle(viewFactory)
        });
        this.viewFactory = viewFactory;
        this.instruction = instruction;
        this.viewSlot = viewSlot;
        this.lookupFunctions = viewResources.lookupFunctions;
        this.observerLocator = observerLocator;
        this.key = 'key';
        this.value = 'value';
        this.strategyLocator = strategyLocator;
        this.ignoreMutation = false;
        this.sourceExpression = getItemsSourceExpression(this.instruction, 'repeat.for');
        this.isOneTime = isOneTime(this.sourceExpression);
        this.viewsRequireLifecycle = viewsRequireLifecycle(viewFactory);
    }
    call(context, changes) {
        this[context](this.items, changes);
    }
    bind(bindingContext, overrideContext) {
        this.scope = { bindingContext, overrideContext };
        this.matcherBinding = this._captureAndRemoveMatcherBinding();
        this.itemsChanged();
    }
    unbind() {
        this.scope = null;
        this.items = null;
        this.matcherBinding = null;
        this.viewSlot.removeAll(true, true);
        this._unsubscribeCollection();
    }
    _unsubscribeCollection() {
        if (this.collectionObserver) {
            this.collectionObserver.unsubscribe(this.callContext, this);
            this.collectionObserver = null;
            this.callContext = null;
        }
    }
    itemsChanged() {
        this._unsubscribeCollection();
        if (!this.scope) {
            return;
        }
        let items = this.items;
        this.strategy = this.strategyLocator.getStrategy(items);
        if (!this.strategy) {
            throw new Error(`Value for '${this.sourceExpression}' is non-repeatable`);
        }
        if (!this.isOneTime && !this._observeInnerCollection()) {
            this._observeCollection();
        }
        this.ignoreMutation = true;
        this.strategy.instanceChanged(this, items);
        this.observerLocator.taskQueue.queueMicroTask(() => {
            this.ignoreMutation = false;
        });
    }
    _getInnerCollection() {
        let expression = unwrapExpression(this.sourceExpression);
        if (!expression) {
            return null;
        }
        return expression.evaluate(this.scope, null);
    }
    handleCollectionMutated(collection, changes) {
        if (!this.collectionObserver) {
            return;
        }
        if (this.ignoreMutation) {
            return;
        }
        this.strategy.instanceMutated(this, collection, changes);
    }
    handleInnerCollectionMutated(collection, changes) {
        if (!this.collectionObserver) {
            return;
        }
        if (this.ignoreMutation) {
            return;
        }
        this.ignoreMutation = true;
        let newItems = this.sourceExpression.evaluate(this.scope, this.lookupFunctions);
        this.observerLocator.taskQueue.queueMicroTask(() => this.ignoreMutation = false);
        if (newItems === this.items) {
            this.itemsChanged();
        }
        else {
            this.items = newItems;
        }
    }
    _observeInnerCollection() {
        let items = this._getInnerCollection();
        let strategy = this.strategyLocator.getStrategy(items);
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
    }
    _observeCollection() {
        let items = this.items;
        this.collectionObserver = this.strategy.getCollectionObserver(this.observerLocator, items);
        if (this.collectionObserver) {
            this.callContext = 'handleCollectionMutated';
            this.collectionObserver.subscribe(this.callContext, this);
        }
    }
    _captureAndRemoveMatcherBinding() {
        if (this.viewFactory.viewFactory) {
            const instructions = this.viewFactory.viewFactory.instructions;
            const instructionIds = Object.keys(instructions);
            for (let i = 0; i < instructionIds.length; i++) {
                const expressions = instructions[instructionIds[i]].expressions;
                if (expressions) {
                    for (let ii = 0; ii < expressions.length; ii++) {
                        if (expressions[ii].targetProperty === 'matcher') {
                            const matcherBinding = expressions[ii];
                            expressions.splice(ii, 1);
                            return matcherBinding;
                        }
                    }
                }
            }
        }
        return undefined;
    }
    viewCount() { return this.viewSlot.children.length; }
    views() { return this.viewSlot.children; }
    view(index) { return this.viewSlot.children[index]; }
    matcher() { return this.matcherBinding ? this.matcherBinding.sourceExpression.evaluate(this.scope, this.matcherBinding.lookupFunctions) : null; }
    addView(bindingContext, overrideContext) {
        let view = this.viewFactory.create();
        view.bind(bindingContext, overrideContext);
        this.viewSlot.add(view);
    }
    insertView(index, bindingContext, overrideContext) {
        let view = this.viewFactory.create();
        view.bind(bindingContext, overrideContext);
        this.viewSlot.insert(index, view);
    }
    moveView(sourceIndex, targetIndex) {
        this.viewSlot.move(sourceIndex, targetIndex);
    }
    removeAllViews(returnToCache, skipAnimation) {
        return this.viewSlot.removeAll(returnToCache, skipAnimation);
    }
    removeViews(viewsToRemove, returnToCache, skipAnimation) {
        return this.viewSlot.removeMany(viewsToRemove, returnToCache, skipAnimation);
    }
    removeView(index, returnToCache, skipAnimation) {
        return this.viewSlot.removeAt(index, returnToCache, skipAnimation);
    }
    updateBindings(view) {
        const $view = view;
        let j = $view.bindings.length;
        while (j--) {
            updateOneTimeBinding($view.bindings[j]);
        }
        j = $view.controllers.length;
        while (j--) {
            let k = $view.controllers[j].boundProperties.length;
            while (k--) {
                let binding = $view.controllers[j].boundProperties[k].binding;
                updateOneTimeBinding(binding);
            }
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

const aureliaHideClassName = 'aurelia-hide';
const aureliaHideClass = `.${aureliaHideClassName} { display:none !important; }`;
function injectAureliaHideStyleAtHead() {
    DOM.injectStyles(aureliaHideClass);
}
function injectAureliaHideStyleAtBoundary(domBoundary) {
    if (FEATURE.shadowDOM && domBoundary && !domBoundary.hasAureliaHideStyle) {
        domBoundary.hasAureliaHideStyle = true;
        DOM.injectStyles(aureliaHideClass, domBoundary);
    }
}

let Show = class Show {
    constructor(element, animator, domBoundary) {
        this.element = element;
        this.animator = animator;
        this.domBoundary = domBoundary;
    }
    static inject() {
        return [DOM.Element, Animator, Optional.of(DOM.boundary, true)];
    }
    created() {
        injectAureliaHideStyleAtBoundary(this.domBoundary);
    }
    valueChanged(newValue) {
        let element = this.element;
        let animator = this.animator;
        if (newValue) {
            animator.removeClass(element, aureliaHideClassName);
        }
        else {
            animator.addClass(element, aureliaHideClassName);
        }
    }
    bind(bindingContext) {
        this.valueChanged(this.value);
    }
};
Show = __decorate([
    customAttribute('show')
], Show);

let Hide = class Hide {
    constructor(element, animator, domBoundary) {
        this.element = element;
        this.animator = animator;
        this.domBoundary = domBoundary;
    }
    static inject() {
        return [DOM.Element, Animator, Optional.of(DOM.boundary, true)];
    }
    created() {
        injectAureliaHideStyleAtBoundary(this.domBoundary);
    }
    valueChanged(newValue) {
        if (newValue) {
            this.animator.addClass(this.element, aureliaHideClassName);
        }
        else {
            this.animator.removeClass(this.element, aureliaHideClassName);
        }
    }
    bind(bindingContext) {
        this.valueChanged(this.value);
    }
    value(value) {
        throw new Error('Method not implemented.');
    }
};
Hide = __decorate([
    customAttribute('hide')
], Hide);

const SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
let needsToWarn = true;
class HTMLSanitizer {
    sanitize(input) {
        if (needsToWarn) {
            needsToWarn = false;
            getLogger('html-sanitizer')
                .warn(`CAUTION: The default HTMLSanitizer does NOT provide security against a wide variety of sophisticated XSS attacks,
and should not be relied on for sanitizing input from unknown sources.
Please see https://aurelia.io/docs/binding/basics#element-content for instructions on how to use a secure solution like DOMPurify or sanitize-html.`);
        }
        return input.replace(SCRIPT_REGEX, '');
    }
}

let SanitizeHTMLValueConverter = class SanitizeHTMLValueConverter {
    constructor(sanitizer) {
        this.sanitizer = sanitizer;
    }
    toView(untrustedMarkup) {
        if (untrustedMarkup === null || untrustedMarkup === undefined) {
            return null;
        }
        return this.sanitizer.sanitize(untrustedMarkup);
    }
};
SanitizeHTMLValueConverter = __decorate([
    valueConverter('sanitizeHTML'),
    inject(HTMLSanitizer)
], SanitizeHTMLValueConverter);

let Replaceable = class Replaceable {
    constructor(viewFactory, viewSlot) {
        this.viewFactory = viewFactory;
        this.viewSlot = viewSlot;
        this.view = null;
    }
    bind(bindingContext, overrideContext) {
        if (this.view === null) {
            this.view = this.viewFactory.create();
            this.viewSlot.add(this.view);
        }
        this.view.bind(bindingContext, overrideContext);
    }
    unbind() {
        this.view.unbind();
    }
};
Replaceable = __decorate([
    customAttribute('replaceable'),
    templateController,
    inject(BoundViewFactory, ViewSlot)
], Replaceable);

let Focus = class Focus {
    constructor(element, taskQueue) {
        this.element = element;
        this.taskQueue = taskQueue;
        this.isAttached = false;
        this.needsApply = false;
    }
    static inject() {
        return [DOM.Element, TaskQueue];
    }
    valueChanged(newValue) {
        if (this.isAttached) {
            this._apply();
        }
        else {
            this.needsApply = true;
        }
    }
    _apply() {
        if (this.value) {
            this.taskQueue.queueMicroTask(() => {
                if (this.value) {
                    this.element.focus();
                }
            });
        }
        else {
            this.element.blur();
        }
    }
    attached() {
        this.isAttached = true;
        if (this.needsApply) {
            this.needsApply = false;
            this._apply();
        }
        this.element.addEventListener('focus', this);
        this.element.addEventListener('blur', this);
    }
    detached() {
        this.isAttached = false;
        this.element.removeEventListener('focus', this);
        this.element.removeEventListener('blur', this);
    }
    handleEvent(e) {
        if (e.type === 'focus') {
            this.value = true;
        }
        else if (DOM.activeElement !== this.element) {
            this.value = false;
        }
    }
};
Focus = __decorate([
    customAttribute('focus', bindingMode.twoWay)
], Focus);

let cssUrlMatcher = /url\((?!['"]data)([^)]+)\)/gi;
function fixupCSSUrls(address, css) {
    if (typeof css !== 'string') {
        throw new Error(`Failed loading required CSS file: ${address}`);
    }
    return css.replace(cssUrlMatcher, (match, p1) => {
        let quote = p1.charAt(0);
        if (quote === '\'' || quote === '"') {
            p1 = p1.substr(1, p1.length - 2);
        }
        return 'url(\'' + relativeToFile(p1, address) + '\')';
    });
}
class CSSResource {
    constructor(address) {
        this.address = address;
        this._scoped = null;
        this._global = false;
        this._alreadyGloballyInjected = false;
    }
    initialize(container, Target) {
        this._scoped = new Target(this);
    }
    register(registry, name) {
        if (name === 'scoped') {
            registry.registerViewEngineHooks(this._scoped);
        }
        else {
            this._global = true;
        }
    }
    load(container) {
        return container.get(Loader)
            .loadText(this.address)
            .catch(err => null)
            .then(text => {
            text = fixupCSSUrls(this.address, text);
            this._scoped.css = text;
            if (this._global) {
                this._alreadyGloballyInjected = true;
                DOM.injectStyles(text);
            }
        });
    }
}
class CSSViewEngineHooks {
    constructor(owner) {
        this.owner = owner;
        this.css = null;
    }
    beforeCompile(content, resources, instruction) {
        if (instruction.targetShadowDOM) {
            DOM.injectStyles(this.css, content, true);
        }
        else if (FEATURE.scopedCSS) {
            let styleNode = DOM.injectStyles(this.css, content, true);
            styleNode.setAttribute('scoped', 'scoped');
        }
        else if (this._global && !this.owner._alreadyGloballyInjected) {
            DOM.injectStyles(this.css);
            this.owner._alreadyGloballyInjected = true;
        }
    }
}
function _createCSSResource(address) {
    let ViewCSS = class ViewCSS extends CSSViewEngineHooks {
    };
    ViewCSS = __decorate([
        resource(new CSSResource(address))
    ], ViewCSS);
    return ViewCSS;
}

let AttrBindingBehavior = class AttrBindingBehavior {
    bind(binding, source) {
        binding.targetObserver = new DataAttributeObserver(binding.target, binding.targetProperty);
    }
    unbind(binding, source) {
    }
};
AttrBindingBehavior = __decorate([
    bindingBehavior('attr')
], AttrBindingBehavior);

let modeBindingBehavior = {
    bind(binding, source, lookupFunctions) {
        binding.originalMode = binding.mode;
        binding.mode = this.mode;
    },
    unbind(binding, source) {
        binding.mode = binding.originalMode;
        binding.originalMode = null;
    }
};
let OneTimeBindingBehavior = class OneTimeBindingBehavior {
    constructor() {
        this.mode = bindingMode.oneTime;
    }
};
OneTimeBindingBehavior = __decorate([
    mixin(modeBindingBehavior),
    bindingBehavior('oneTime')
], OneTimeBindingBehavior);
let OneWayBindingBehavior = class OneWayBindingBehavior {
    constructor() {
        this.mode = bindingMode.toView;
    }
};
OneWayBindingBehavior = __decorate([
    mixin(modeBindingBehavior),
    bindingBehavior('oneWay')
], OneWayBindingBehavior);
let ToViewBindingBehavior = class ToViewBindingBehavior {
    constructor() {
        this.mode = bindingMode.toView;
    }
};
ToViewBindingBehavior = __decorate([
    mixin(modeBindingBehavior),
    bindingBehavior('toView')
], ToViewBindingBehavior);
let FromViewBindingBehavior = class FromViewBindingBehavior {
    constructor() {
        this.mode = bindingMode.fromView;
    }
};
FromViewBindingBehavior = __decorate([
    mixin(modeBindingBehavior),
    bindingBehavior('fromView')
], FromViewBindingBehavior);
let TwoWayBindingBehavior = class TwoWayBindingBehavior {
    constructor() {
        this.mode = bindingMode.twoWay;
    }
};
TwoWayBindingBehavior = __decorate([
    mixin(modeBindingBehavior),
    bindingBehavior('twoWay')
], TwoWayBindingBehavior);

function throttle(newValue) {
    let state = this.throttleState;
    let elapsed = +new Date() - state.last;
    if (elapsed >= state.delay) {
        clearTimeout(state.timeoutId);
        state.timeoutId = null;
        state.last = +new Date();
        this.throttledMethod(newValue);
        return;
    }
    state.newValue = newValue;
    if (state.timeoutId === null) {
        state.timeoutId = setTimeout(() => {
            state.timeoutId = null;
            state.last = +new Date();
            this.throttledMethod(state.newValue);
        }, state.delay - elapsed);
    }
}
let ThrottleBindingBehavior = class ThrottleBindingBehavior {
    bind(binding, source, delay = 200) {
        let methodToThrottle = 'updateTarget';
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
    }
    unbind(binding, source) {
        let methodToRestore = binding.throttledMethod.originalName;
        binding[methodToRestore] = binding.throttledMethod;
        binding.throttledMethod = null;
        clearTimeout(binding.throttleState.timeoutId);
        binding.throttleState = null;
    }
};
ThrottleBindingBehavior = __decorate([
    bindingBehavior('throttle')
], ThrottleBindingBehavior);

const unset = {};
function debounceCallSource(event) {
    const state = this.debounceState;
    clearTimeout(state.timeoutId);
    state.timeoutId = setTimeout(() => this.debouncedMethod(event), state.delay);
}
function debounceCall(context, newValue, oldValue) {
    const state = this.debounceState;
    clearTimeout(state.timeoutId);
    if (context !== state.callContextToDebounce) {
        state.oldValue = unset;
        this.debouncedMethod(context, newValue, oldValue);
        return;
    }
    if (state.oldValue === unset) {
        state.oldValue = oldValue;
    }
    state.timeoutId = setTimeout(() => {
        const _oldValue = state.oldValue;
        state.oldValue = unset;
        this.debouncedMethod(context, newValue, _oldValue);
    }, state.delay);
}
let DebounceBindingBehavior = class DebounceBindingBehavior {
    bind(binding, source, delay = 200) {
        const isCallSource = binding.callSource !== undefined;
        const methodToDebounce = isCallSource ? 'callSource' : 'call';
        const debouncer = isCallSource ? debounceCallSource : debounceCall;
        const mode = binding.mode;
        const callContextToDebounce = mode === bindingMode.twoWay || mode === bindingMode.fromView ? targetContext : sourceContext;
        binding.debouncedMethod = binding[methodToDebounce];
        binding.debouncedMethod.originalName = methodToDebounce;
        binding[methodToDebounce] = debouncer;
        binding.debounceState = {
            callContextToDebounce,
            delay,
            timeoutId: 0,
            oldValue: unset
        };
    }
    unbind(binding, source) {
        const methodToRestore = binding.debouncedMethod.originalName;
        binding[methodToRestore] = binding.debouncedMethod;
        binding.debouncedMethod = null;
        clearTimeout(binding.debounceState.timeoutId);
        binding.debounceState = null;
    }
};
DebounceBindingBehavior = __decorate([
    bindingBehavior('debounce')
], DebounceBindingBehavior);

function findOriginalEventTarget(event) {
    return (event.path && event.path[0]) || (event.deepPath && event.deepPath[0]) || event.target;
}
function handleSelfEvent(event) {
    let target = findOriginalEventTarget(event);
    if (this.target !== target) {
        return;
    }
    this.selfEventCallSource(event);
}
let SelfBindingBehavior = class SelfBindingBehavior {
    bind(binding, source) {
        if (!binding.callSource || !binding.targetEvent) {
            throw new Error('Self binding behavior only supports event.');
        }
        binding.selfEventCallSource = binding.callSource;
        binding.callSource = handleSelfEvent;
    }
    unbind(binding, source) {
        binding.callSource = binding.selfEventCallSource;
        binding.selfEventCallSource = null;
    }
};
SelfBindingBehavior = __decorate([
    bindingBehavior('self')
], SelfBindingBehavior);

class BindingSignaler {
    constructor() {
        this.signals = {};
    }
    signal(name) {
        let bindings = this.signals[name];
        if (!bindings) {
            return;
        }
        let i = bindings.length;
        while (i--) {
            bindings[i].call(sourceContext);
        }
    }
}

let SignalBindingBehavior = class SignalBindingBehavior {
    constructor(bindingSignaler) {
        this.signals = bindingSignaler.signals;
    }
    static inject() { return [BindingSignaler]; }
    bind(binding, source, ...names) {
        if (!binding.updateTarget) {
            throw new Error('Only property bindings and string interpolation bindings can be signaled.  Trigger, delegate and call bindings cannot be signaled.');
        }
        let signals = this.signals;
        if (names.length === 1) {
            let name = names[0];
            let bindings = signals[name] || (signals[name] = []);
            bindings.push(binding);
            binding.signalName = name;
        }
        else if (names.length > 1) {
            let i = names.length;
            while (i--) {
                let name = names[i];
                let bindings = signals[name] || (signals[name] = []);
                bindings.push(binding);
            }
            binding.signalName = names;
        }
        else {
            throw new Error('Signal name is required.');
        }
    }
    unbind(binding, source) {
        let signals = this.signals;
        let name = binding.signalName;
        binding.signalName = null;
        if (Array.isArray(name)) {
            let names = name;
            let i = names.length;
            while (i--) {
                let n = names[i];
                let bindings = signals[n];
                bindings.splice(bindings.indexOf(binding), 1);
            }
        }
        else {
            let bindings = signals[name];
            bindings.splice(bindings.indexOf(binding), 1);
        }
    }
};
SignalBindingBehavior = __decorate([
    bindingBehavior('signal')
], SignalBindingBehavior);

const eventNamesRequired = 'The updateTrigger binding behavior requires at least one event name argument: eg <input value.bind="firstName & updateTrigger:\'blur\'">';
const notApplicableMessage = 'The updateTrigger binding behavior can only be applied to two-way/ from-view bindings on input/select elements.';
let UpdateTriggerBindingBehavior = class UpdateTriggerBindingBehavior {
    bind(binding, source, ...events) {
        if (events.length === 0) {
            throw new Error(eventNamesRequired);
        }
        if (binding.mode !== bindingMode.twoWay && binding.mode !== bindingMode.fromView) {
            throw new Error(notApplicableMessage);
        }
        let targetObserver = binding.observerLocator.getObserver(binding.target, binding.targetProperty);
        if (!targetObserver.handler) {
            throw new Error(notApplicableMessage);
        }
        binding.targetObserver = targetObserver;
        targetObserver.originalHandler = binding.targetObserver.handler;
        let handler = new EventSubscriber(events);
        targetObserver.handler = handler;
    }
    unbind(binding, source) {
        let targetObserver = binding.targetObserver;
        targetObserver.handler.dispose();
        targetObserver.handler = targetObserver.originalHandler;
        targetObserver.originalHandler = null;
    }
};
UpdateTriggerBindingBehavior = __decorate([
    bindingBehavior('updateTrigger')
], UpdateTriggerBindingBehavior);

function _createDynamicElement({ name, viewUrl, bindableNames, useShadowDOMmode }) {
    let DynamicElement = class DynamicElement {
        bind(bindingContext) {
            this.$parent = bindingContext;
        }
    };
    DynamicElement = __decorate([
        customElement(name),
        useView(viewUrl)
    ], DynamicElement);
    for (let i = 0, ii = bindableNames.length; i < ii; ++i) {
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
                .warn(`Expected 'use-shadow-dom' value to be "close", "open" or "", received ${useShadowDOMmode}`);
            break;
    }
    return DynamicElement;
}

function getElementName(address) {
    return /([^\/^\?]+)\.html/i.exec(address)[1].toLowerCase();
}
function configure(config) {
    const viewEngine = config.container.get(ViewEngine);
    const loader = config.aurelia.loader;
    viewEngine.addResourcePlugin('.html', {
        'fetch': function (viewUrl) {
            return loader.loadTemplate(viewUrl).then(registryEntry => {
                let bindableNames = registryEntry.template.getAttribute('bindable');
                const useShadowDOMmode = registryEntry.template.getAttribute('use-shadow-dom');
                const name = getElementName(viewUrl);
                if (bindableNames) {
                    bindableNames = bindableNames.split(',').map(x => x.trim());
                    registryEntry.template.removeAttribute('bindable');
                }
                else {
                    bindableNames = [];
                }
                return { [name]: _createDynamicElement({ name, viewUrl, bindableNames, useShadowDOMmode }) };
            });
        }
    });
}

function configure$1(config) {
    injectAureliaHideStyleAtHead();
    config.globalResources(Compose, If, Else, With, Repeat, Show, Hide, Replaceable, Focus, SanitizeHTMLValueConverter, OneTimeBindingBehavior, OneWayBindingBehavior, ToViewBindingBehavior, FromViewBindingBehavior, TwoWayBindingBehavior, ThrottleBindingBehavior, DebounceBindingBehavior, SelfBindingBehavior, SignalBindingBehavior, UpdateTriggerBindingBehavior, AttrBindingBehavior);
    configure(config);
    let viewEngine = config.container.get(ViewEngine);
    let styleResourcePlugin = {
        fetch(address) {
            return { [address]: _createCSSResource(address) };
        }
    };
    ['.css', '.less', '.sass', '.scss', '.styl'].forEach(ext => viewEngine.addResourcePlugin(ext, styleResourcePlugin));
}

export { AbstractRepeater, ArrayRepeatStrategy, AttrBindingBehavior, BindingSignaler, Compose, DebounceBindingBehavior, Else, Focus, FromViewBindingBehavior, HTMLSanitizer, Hide, If, MapRepeatStrategy, NullRepeatStrategy, NumberRepeatStrategy, OneTimeBindingBehavior, OneWayBindingBehavior, Repeat, RepeatStrategyLocator, Replaceable, SanitizeHTMLValueConverter, SelfBindingBehavior, SetRepeatStrategy, Show, SignalBindingBehavior, ThrottleBindingBehavior, ToViewBindingBehavior, TwoWayBindingBehavior, UpdateTriggerBindingBehavior, With, configure$1 as configure, createFullOverrideContext, getItemsSourceExpression, isOneTime, unwrapExpression, updateOneTimeBinding, updateOverrideContext, viewsRequireLifecycle };
//# sourceMappingURL=aurelia-templating-resources.js.map
