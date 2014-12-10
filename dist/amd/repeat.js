define(["exports", "aurelia-binding", "aurelia-templating"], function (exports, _aureliaBinding, _aureliaTemplating) {
  "use strict";

  var ObserverLocator = _aureliaBinding.ObserverLocator;
  var calcSplices = _aureliaBinding.calcSplices;
  var TemplateController = _aureliaTemplating.TemplateController;
  var BoundViewFactory = _aureliaTemplating.BoundViewFactory;
  var ViewSlot = _aureliaTemplating.ViewSlot;
  var Property = _aureliaTemplating.Property;
  var Repeat = (function () {
    var Repeat = function Repeat(viewFactory, viewSlot, observerLocator) {
      this.viewFactory = viewFactory;
      this.viewSlot = viewSlot;
      this.observerLocator = observerLocator;
      this.local = "item";
    };

    Repeat.annotations = function () {
      return [new TemplateController("repeat"), new Property("items", "itemsChanged", "repeat"), new Property("local")];
    };

    Repeat.inject = function () {
      return [BoundViewFactory, ViewSlot, ObserverLocator];
    };

    Repeat.prototype.bind = function (executionContext) {
      var _this = this;
      var items = this.items;

      this.executionContext = executionContext;

      if (this.oldItems === items) {
        var splices = calcSplices(items, 0, items.length, this.lastBoundItems, 0, this.lastBoundItems.length);
        var observer = this.observerLocator.getArrayObserver(items);

        this.handleSplices(items, splices);
        this.lastBoundItems = this.oldItems = null;

        this.disposeArraySubscription = observer.subscribe(function (splices) {
          _this.handleSplices(items, splices);
        });
      } else {
        this.processItems();
      }
    };

    Repeat.prototype.unbind = function () {
      this.oldItems = this.items;
      this.lastBoundItems = this.items.slice(0);

      if (this.disposeArraySubscription) {
        this.disposeArraySubscription();
        this.disposeArraySubscription = null;
      }
    };

    Repeat.prototype.itemsChanged = function () {
      this.processItems();
    };

    Repeat.prototype.processItems = function () {
      var _this2 = this;
      var items = this.items, observer = this.observerLocator.getArrayObserver(items), viewSlot = this.viewSlot, viewFactory = this.viewFactory;

      if (this.disposeArraySubscription) {
        this.disposeArraySubscription();
        viewSlot.removeAll();
      }

      for (var i = 0, ii = items.length; i < ii; i++) {
        var row = this.createFullExecutionContext(items[i], i, ii);
        var view = viewFactory.create(row);
        viewSlot.add(view);
      }

      this.disposeArraySubscription = observer.subscribe(function (splices) {
        _this2.handleSplices(items, splices);
      });
    };

    Repeat.prototype.createBaseExecutionContext = function (data) {
      var context = {};
      context[this.local] = data;
      return context;
    };

    Repeat.prototype.createFullExecutionContext = function (data, index, length) {
      var context = this.createBaseExecutionContext(data);
      return this.updateExecutionContext(context, index, length);
    };

    Repeat.prototype.updateExecutionContext = function (context, index, length) {
      var first = (index === 0), last = (index === length - 1), even = index % 2 === 0;

      context.$parent = this.executionContext;
      context.$index = index;
      context.$first = first;
      context.$last = last;
      context.$middle = !(first || last);
      context.$odd = !even;
      context.$even = even;

      return context;
    };

    Repeat.prototype.handleSplices = function (array, splices) {
      var viewLookup = new Map(), removeDelta = 0, arrayLength = array.length, viewSlot = this.viewSlot, viewFactory = this.viewFactory, i, ii, j, jj, splice, removed, addIndex, end, model, view, children, length, row;

      for (i = 0, ii = splices.length; i < ii; i++) {
        splice = splices[i];
        removed = splice.removed;

        for (j = 0, jj = removed.length; j < jj; j++) {
          model = removed[j];
          view = viewSlot.removeAt(splice.index + removeDelta);

          if (view) {
            viewLookup.set(model, view);
          }
        }

        removeDelta -= splice.addedCount;
      }

      for (i = 0, ii = splices.length; i < ii; i++) {
        splice = splices[i];
        addIndex = splice.index;
        end = splice.index + splice.addedCount;

        for (; addIndex < end; addIndex++) {
          model = array[addIndex];
          view = viewLookup.get(model);

          if (view) {
            viewLookup["delete"](model);
            viewSlot.insert(addIndex, view);
          } else {
            row = this.createBaseExecutionContext(model);
            view = this.viewFactory.create(row);
            viewSlot.insert(addIndex, view);
          }
        }
      }

      children = viewSlot.children;
      length = children.length;

      for (i = 0; i < length; i++) {
        this.updateExecutionContext(children[i].executionContext, i, length);
      }

      viewLookup.forEach(function (x) {
        return x.unbind();
      });
    };

    return Repeat;
  })();

  exports.Repeat = Repeat;
});