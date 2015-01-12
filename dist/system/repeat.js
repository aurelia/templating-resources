System.register(["aurelia-binding", "aurelia-templating"], function (_export) {
  "use strict";

  var ObserverLocator, calcSplices, TemplateController, BoundViewFactory, ViewSlot, Property, _prototypeProperties, Repeat;
  return {
    setters: [function (_aureliaBinding) {
      ObserverLocator = _aureliaBinding.ObserverLocator;
      calcSplices = _aureliaBinding.calcSplices;
    }, function (_aureliaTemplating) {
      TemplateController = _aureliaTemplating.TemplateController;
      BoundViewFactory = _aureliaTemplating.BoundViewFactory;
      ViewSlot = _aureliaTemplating.ViewSlot;
      Property = _aureliaTemplating.Property;
    }],
    execute: function () {
      _prototypeProperties = function (child, staticProps, instanceProps) {
        if (staticProps) Object.defineProperties(child, staticProps);
        if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
      };

      Repeat = (function () {
        var Repeat = function Repeat(viewFactory, viewSlot, observerLocator) {
          this.viewFactory = viewFactory;
          this.viewSlot = viewSlot;
          this.observerLocator = observerLocator;
          this.local = "item";
        };

        _prototypeProperties(Repeat, {
          annotations: {
            value: function () {
              return [new TemplateController("repeat"), new Property("items", "itemsChanged", "repeat"), new Property("local")];
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          inject: {
            value: function () {
              return [BoundViewFactory, ViewSlot, ObserverLocator];
            },
            writable: true,
            enumerable: true,
            configurable: true
          }
        }, {
          bind: {
            value: function (executionContext) {
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
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          unbind: {
            value: function () {
              this.oldItems = this.items;
              this.lastBoundItems = this.items.slice(0);

              if (this.disposeArraySubscription) {
                this.disposeArraySubscription();
                this.disposeArraySubscription = null;
              }
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          itemsChanged: {
            value: function () {
              this.processItems();
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          processItems: {
            value: function () {
              var _this2 = this;
              var items = this.items, observer = this.observerLocator.getArrayObserver(items), viewSlot = this.viewSlot, viewFactory = this.viewFactory, i, ii, row, view;

              if (this.disposeArraySubscription) {
                this.disposeArraySubscription();
                viewSlot.removeAll();
              }

              for (i = 0, ii = items.length; i < ii; ++i) {
                row = this.createFullExecutionContext(items[i], i, ii);
                view = viewFactory.create(row);
                viewSlot.add(view);
              }

              this.disposeArraySubscription = observer.subscribe(function (splices) {
                _this2.handleSplices(items, splices);
              });
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          createBaseExecutionContext: {
            value: function (data) {
              var context = {};
              context[this.local] = data;
              return context;
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          createFullExecutionContext: {
            value: function (data, index, length) {
              var context = this.createBaseExecutionContext(data);
              return this.updateExecutionContext(context, index, length);
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          updateExecutionContext: {
            value: function (context, index, length) {
              var first = index === 0,
                  last = index === length - 1,
                  even = index % 2 === 0;

              context.$parent = this.executionContext;
              context.$index = index;
              context.$first = first;
              context.$last = last;
              context.$middle = !(first || last);
              context.$odd = !even;
              context.$even = even;

              return context;
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          handleSplices: {
            value: function (array, splices) {
              var viewLookup = new Map(), removeDelta = 0, arrayLength = array.length, viewSlot = this.viewSlot, viewFactory = this.viewFactory, i, ii, j, jj, splice, removed, addIndex, end, model, view, children, length, row;

              for (i = 0, ii = splices.length; i < ii; ++i) {
                splice = splices[i];
                removed = splice.removed;

                for (j = 0, jj = removed.length; j < jj; ++j) {
                  model = removed[j];
                  view = viewSlot.removeAt(splice.index + removeDelta);

                  if (view) {
                    viewLookup.set(model, view);
                  }
                }

                removeDelta -= splice.addedCount;
              }

              for (i = 0, ii = splices.length; i < ii; ++i) {
                splice = splices[i];
                addIndex = splice.index;
                end = splice.index + splice.addedCount;

                for (; addIndex < end; ++addIndex) {
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
            },
            writable: true,
            enumerable: true,
            configurable: true
          }
        });

        return Repeat;
      })();
      _export("Repeat", Repeat);
    }
  };
});