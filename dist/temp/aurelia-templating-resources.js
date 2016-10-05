'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Repeat = exports.RepeatStrategyLocator = exports.Show = exports.Hide = exports.SignalBindingBehavior = exports.SanitizeHTMLValueConverter = exports.SetRepeatStrategy = exports.NumberRepeatStrategy = exports.MapRepeatStrategy = exports.ArrayRepeatStrategy = exports.AbstractRepeater = exports.lifecycleOptionalBehaviors = exports.AttrBindingBehavior = exports.aureliaHideClassName = exports.TwoWayBindingBehavior = exports.OneWayBindingBehavior = exports.OneTimeBindingBehavior = exports.BindingSignaler = exports.Compose = exports.DebounceBindingBehavior = exports.Focus = exports.HTMLSanitizer = exports.If = exports.NullRepeatStrategy = exports.Replaceable = exports.ThrottleBindingBehavior = exports.UpdateTriggerBindingBehavior = exports.With = undefined;

var _dec, _dec2, _class, _class2, _temp, _dec3, _dec4, _class3, _dec5, _dec6, _class4, _dec7, _dec8, _class5, _dec12, _dec13, _class8, _desc, _value, _class9, _descriptor, _descriptor2, _descriptor3, _dec14, _class12, _dec15, _class13, _dec16, _class14, _dec17, _dec18, _class15, _dec19, _dec20, _class17, _dec21, _dec22, _class18, _dec23, _dec24, _class19, _desc2, _value2, _class20, _descriptor4, _descriptor5, _descriptor6, _descriptor7;

exports.updateOverrideContexts = updateOverrideContexts;
exports.createFullOverrideContext = createFullOverrideContext;
exports.updateOverrideContext = updateOverrideContext;
exports.getItemsSourceExpression = getItemsSourceExpression;
exports.unwrapExpression = unwrapExpression;
exports.isOneTime = isOneTime;
exports.updateOneTimeBinding = updateOneTimeBinding;
exports.indexOf = indexOf;
exports._createDynamicElement = _createDynamicElement;
exports._createCSSResource = _createCSSResource;
exports.injectAureliaHideStyleAtHead = injectAureliaHideStyleAtHead;
exports.injectAureliaHideStyleAtBoundary = injectAureliaHideStyleAtBoundary;
exports.viewsRequireLifecycle = viewsRequireLifecycle;
exports.getElementName = getElementName;
exports.configure = configure;

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaTemplating = require('aurelia-templating');

var _aureliaBinding = require('aurelia-binding');

var _aureliaTaskQueue = require('aurelia-task-queue');

var _aureliaPal = require('aurelia-pal');

var _aureliaLoader = require('aurelia-loader');

var _aureliaPath = require('aurelia-path');

var _aureliaMetadata = require('aurelia-metadata');

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _initializerWarningHelper(descriptor, context) {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var With = exports.With = (_dec = (0, _aureliaTemplating.customAttribute)('with'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.ViewSlot), _dec(_class = (0, _aureliaTemplating.templateController)(_class = _dec2(_class = function () {
  function With(viewFactory, viewSlot) {
    _classCallCheck(this, With);

    this.viewFactory = viewFactory;
    this.viewSlot = viewSlot;
    this.parentOverrideContext = null;
    this.view = null;
  }

  With.prototype.bind = function bind(bindingContext, overrideContext) {
    this.parentOverrideContext = overrideContext;
    this.valueChanged(this.value);
  };

  With.prototype.valueChanged = function valueChanged(newValue) {
    var overrideContext = (0, _aureliaBinding.createOverrideContext)(newValue, this.parentOverrideContext);
    if (!this.view) {
      this.view = this.viewFactory.create();
      this.view.bind(newValue, overrideContext);
      this.viewSlot.add(this.view);
    } else {
      this.view.bind(newValue, overrideContext);
    }
  };

  With.prototype.unbind = function unbind() {
    this.parentOverrideContext = null;

    if (this.view) {
      this.view.unbind();
    }
  };

  return With;
}()) || _class) || _class) || _class);


var eventNamesRequired = 'The updateTrigger binding behavior requires at least one event name argument: eg <input value.bind="firstName & updateTrigger:\'blur\'">';
var notApplicableMessage = 'The updateTrigger binding behavior can only be applied to two-way bindings on input/select elements.';

var UpdateTriggerBindingBehavior = exports.UpdateTriggerBindingBehavior = (_temp = _class2 = function () {
  function UpdateTriggerBindingBehavior(eventManager) {
    _classCallCheck(this, UpdateTriggerBindingBehavior);

    this.eventManager = eventManager;
  }

  UpdateTriggerBindingBehavior.prototype.bind = function bind(binding, source) {
    for (var _len = arguments.length, events = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      events[_key - 2] = arguments[_key];
    }

    if (events.length === 0) {
      throw new Error(eventNamesRequired);
    }
    if (binding.mode !== _aureliaBinding.bindingMode.twoWay) {
      throw new Error(notApplicableMessage);
    }

    var targetObserver = binding.observerLocator.getObserver(binding.target, binding.targetProperty);
    if (!targetObserver.handler) {
      throw new Error(notApplicableMessage);
    }
    binding.targetObserver = targetObserver;

    targetObserver.originalHandler = binding.targetObserver.handler;

    var handler = this.eventManager.createElementHandler(events);
    targetObserver.handler = handler;
  };

  UpdateTriggerBindingBehavior.prototype.unbind = function unbind(binding, source) {
    binding.targetObserver.handler = binding.targetObserver.originalHandler;
    binding.targetObserver.originalHandler = null;
  };

  return UpdateTriggerBindingBehavior;
}(), _class2.inject = [_aureliaBinding.EventManager], _temp);


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

var ThrottleBindingBehavior = exports.ThrottleBindingBehavior = function () {
  function ThrottleBindingBehavior() {
    _classCallCheck(this, ThrottleBindingBehavior);
  }

  ThrottleBindingBehavior.prototype.bind = function bind(binding, source) {
    var delay = arguments.length <= 2 || arguments[2] === undefined ? 200 : arguments[2];

    var methodToThrottle = 'updateTarget';
    if (binding.callSource) {
      methodToThrottle = 'callSource';
    } else if (binding.updateSource && binding.mode === _aureliaBinding.bindingMode.twoWay) {
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

  ThrottleBindingBehavior.prototype.unbind = function unbind(binding, source) {
    var methodToRestore = binding.throttledMethod.originalName;
    binding[methodToRestore] = binding.throttledMethod;
    binding.throttledMethod = null;
    clearTimeout(binding.throttleState.timeoutId);
    binding.throttleState = null;
  };

  return ThrottleBindingBehavior;
}();

var Replaceable = exports.Replaceable = (_dec3 = (0, _aureliaTemplating.customAttribute)('replaceable'), _dec4 = (0, _aureliaDependencyInjection.inject)(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.ViewSlot), _dec3(_class3 = (0, _aureliaTemplating.templateController)(_class3 = _dec4(_class3 = function () {
  function Replaceable(viewFactory, viewSlot) {
    _classCallCheck(this, Replaceable);

    this.viewFactory = viewFactory;
    this.viewSlot = viewSlot;
    this.view = null;
  }

  Replaceable.prototype.bind = function bind(bindingContext, overrideContext) {
    if (this.view === null) {
      this.view = this.viewFactory.create();
      this.viewSlot.add(this.view);
    }

    this.view.bind(bindingContext, overrideContext);
  };

  Replaceable.prototype.unbind = function unbind() {
    this.view.unbind();
  };

  return Replaceable;
}()) || _class3) || _class3) || _class3);


var oneTime = _aureliaBinding.bindingMode.oneTime;

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
  var overrideContext = (0, _aureliaBinding.createOverrideContext)(bindingContext, repeat.scope.overrideContext);

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
  while (expression instanceof _aureliaBinding.BindingBehavior) {
    expression = expression.expression;
  }
  while (expression instanceof _aureliaBinding.ValueConverter) {
    expression = expression.expression;
    unwrapped = true;
  }
  return unwrapped ? expression : null;
}

function isOneTime(expression) {
  while (expression instanceof _aureliaBinding.BindingBehavior) {
    if (expression.name === 'oneTime') {
      return true;
    }
    expression = expression.expression;
  }
  return false;
}

function updateOneTimeBinding(binding) {
  if (binding.call && binding.mode === oneTime) {
    binding.call(_aureliaBinding.sourceContext);
  } else if (binding.updateOneTimeBindings) {
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

var NullRepeatStrategy = exports.NullRepeatStrategy = function () {
  function NullRepeatStrategy() {
    _classCallCheck(this, NullRepeatStrategy);
  }

  NullRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, items) {
    repeat.removeAllViews(true);
  };

  NullRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver(observerLocator, items) {};

  return NullRepeatStrategy;
}();

var If = exports.If = (_dec5 = (0, _aureliaTemplating.customAttribute)('if'), _dec6 = (0, _aureliaDependencyInjection.inject)(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.ViewSlot), _dec5(_class4 = (0, _aureliaTemplating.templateController)(_class4 = _dec6(_class4 = function () {
  function If(viewFactory, viewSlot) {
    _classCallCheck(this, If);

    this.viewFactory = viewFactory;
    this.viewSlot = viewSlot;
    this.showing = false;
    this.view = null;
    this.bindingContext = null;
    this.overrideContext = null;
  }

  If.prototype.bind = function bind(bindingContext, overrideContext) {
    this.bindingContext = bindingContext;
    this.overrideContext = overrideContext;
    this.valueChanged(this.value);
  };

  If.prototype.valueChanged = function valueChanged(newValue) {
    var _this2 = this;

    if (this.__queuedChanges) {
      this.__queuedChanges.push(newValue);
      return;
    }

    var maybePromise = this._runValueChanged(newValue);
    if (maybePromise instanceof Promise) {
      (function () {
        var queuedChanges = _this2.__queuedChanges = [];

        var runQueuedChanges = function runQueuedChanges() {
          if (!queuedChanges.length) {
            _this2.__queuedChanges = undefined;
            return;
          }

          var nextPromise = _this2._runValueChanged(queuedChanges.shift()) || Promise.resolve();
          nextPromise.then(runQueuedChanges);
        };

        maybePromise.then(runQueuedChanges);
      })();
    }
  };

  If.prototype._runValueChanged = function _runValueChanged(newValue) {
    var _this3 = this;

    if (!newValue) {
      var viewOrPromise = void 0;
      if (this.view !== null && this.showing) {
        viewOrPromise = this.viewSlot.remove(this.view);
        if (viewOrPromise instanceof Promise) {
          viewOrPromise.then(function () {
            return _this3.view.unbind();
          });
        } else {
          this.view.unbind();
        }
      }

      this.showing = false;
      return viewOrPromise;
    }

    if (this.view === null) {
      this.view = this.viewFactory.create();
    }

    if (!this.view.isBound) {
      this.view.bind(this.bindingContext, this.overrideContext);
    }

    if (!this.showing) {
      this.showing = true;
      return this.viewSlot.add(this.view);
    }

    return undefined;
  };

  If.prototype.unbind = function unbind() {
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
    this.view.returnToCache();
    this.view = null;
  };

  return If;
}()) || _class4) || _class4) || _class4);


var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

var HTMLSanitizer = exports.HTMLSanitizer = function () {
  function HTMLSanitizer() {
    _classCallCheck(this, HTMLSanitizer);
  }

  HTMLSanitizer.prototype.sanitize = function sanitize(input) {
    return input.replace(SCRIPT_REGEX, '');
  };

  return HTMLSanitizer;
}();

var Focus = exports.Focus = (_dec7 = (0, _aureliaTemplating.customAttribute)('focus', _aureliaBinding.bindingMode.twoWay), _dec8 = (0, _aureliaDependencyInjection.inject)(_aureliaPal.DOM.Element, _aureliaTaskQueue.TaskQueue), _dec7(_class5 = _dec8(_class5 = function () {
  function Focus(element, taskQueue) {
    var _this4 = this;

    _classCallCheck(this, Focus);

    this.element = element;
    this.taskQueue = taskQueue;
    this.isAttached = false;
    this.needsApply = false;

    this.focusListener = function (e) {
      _this4.value = true;
    };
    this.blurListener = function (e) {
      if (_aureliaPal.DOM.activeElement !== _this4.element) {
        _this4.value = false;
      }
    };
  }

  Focus.prototype.valueChanged = function valueChanged(newValue) {
    if (this.isAttached) {
      this._apply();
    } else {
      this.needsApply = true;
    }
  };

  Focus.prototype._apply = function _apply() {
    var _this5 = this;

    if (this.value) {
      this.taskQueue.queueMicroTask(function () {
        if (_this5.value) {
          _this5.element.focus();
        }
      });
    } else {
      this.element.blur();
    }
  };

  Focus.prototype.attached = function attached() {
    this.isAttached = true;
    if (this.needsApply) {
      this.needsApply = false;
      this._apply();
    }
    this.element.addEventListener('focus', this.focusListener);
    this.element.addEventListener('blur', this.blurListener);
  };

  Focus.prototype.detached = function detached() {
    this.isAttached = false;
    this.element.removeEventListener('focus', this.focusListener);
    this.element.removeEventListener('blur', this.blurListener);
  };

  return Focus;
}()) || _class5) || _class5);
function _createDynamicElement(name, viewUrl, bindableNames) {
  var _dec9, _dec10, _class6;

  var DynamicElement = (_dec9 = (0, _aureliaTemplating.customElement)(name), _dec10 = (0, _aureliaTemplating.useView)(viewUrl), _dec9(_class6 = _dec10(_class6 = function () {
    function DynamicElement() {
      _classCallCheck(this, DynamicElement);
    }

    DynamicElement.prototype.bind = function bind(bindingContext) {
      this.$parent = bindingContext;
    };

    return DynamicElement;
  }()) || _class6) || _class6);

  for (var i = 0, ii = bindableNames.length; i < ii; ++i) {
    (0, _aureliaTemplating.bindable)(bindableNames[i])(DynamicElement);
  }
  return DynamicElement;
}

function debounce(newValue) {
  var _this6 = this;

  var state = this.debounceState;
  if (state.immediate) {
    state.immediate = false;
    this.debouncedMethod(newValue);
    return;
  }
  clearTimeout(state.timeoutId);
  state.timeoutId = setTimeout(function () {
    return _this6.debouncedMethod(newValue);
  }, state.delay);
}

var DebounceBindingBehavior = exports.DebounceBindingBehavior = function () {
  function DebounceBindingBehavior() {
    _classCallCheck(this, DebounceBindingBehavior);
  }

  DebounceBindingBehavior.prototype.bind = function bind(binding, source) {
    var delay = arguments.length <= 2 || arguments[2] === undefined ? 200 : arguments[2];

    var methodToDebounce = 'updateTarget';
    if (binding.callSource) {
      methodToDebounce = 'callSource';
    } else if (binding.updateSource && binding.mode === _aureliaBinding.bindingMode.twoWay) {
        methodToDebounce = 'updateSource';
      }

    binding.debouncedMethod = binding[methodToDebounce];
    binding.debouncedMethod.originalName = methodToDebounce;

    binding[methodToDebounce] = debounce;

    binding.debounceState = {
      delay: delay,
      timeoutId: null,
      immediate: methodToDebounce === 'updateTarget' };
  };

  DebounceBindingBehavior.prototype.unbind = function unbind(binding, source) {
    var methodToRestore = binding.debouncedMethod.originalName;
    binding[methodToRestore] = binding.debouncedMethod;
    binding.debouncedMethod = null;
    clearTimeout(binding.debounceState.timeoutId);
    binding.debounceState = null;
  };

  return DebounceBindingBehavior;
}();

var cssUrlMatcher = /url\((?!['"]data)([^)]+)\)/gi;

function fixupCSSUrls(address, css) {
  if (typeof css !== 'string') {
    throw new Error('Failed loading required CSS file: ' + address);
  }
  return css.replace(cssUrlMatcher, function (match, p1) {
    var quote = p1.charAt(0);
    if (quote === '\'' || quote === '"') {
      p1 = p1.substr(1, p1.length - 2);
    }
    return 'url(\'' + (0, _aureliaPath.relativeToFile)(p1, address) + '\')';
  });
}

var CSSResource = function () {
  function CSSResource(address) {
    _classCallCheck(this, CSSResource);

    this.address = address;
    this._scoped = null;
    this._global = false;
    this._alreadyGloballyInjected = false;
  }

  CSSResource.prototype.initialize = function initialize(container, target) {
    this._scoped = new target(this);
  };

  CSSResource.prototype.register = function register(registry, name) {
    if (name === 'scoped') {
      registry.registerViewEngineHooks(this._scoped);
    } else {
      this._global = true;
    }
  };

  CSSResource.prototype.load = function load(container) {
    var _this7 = this;

    return container.get(_aureliaLoader.Loader).loadText(this.address).catch(function (err) {
      return null;
    }).then(function (text) {
      text = fixupCSSUrls(_this7.address, text);
      _this7._scoped.css = text;
      if (_this7._global) {
        _this7._alreadyGloballyInjected = true;
        _aureliaPal.DOM.injectStyles(text);
      }
    });
  };

  return CSSResource;
}();

var CSSViewEngineHooks = function () {
  function CSSViewEngineHooks(owner) {
    _classCallCheck(this, CSSViewEngineHooks);

    this.owner = owner;
    this.css = null;
  }

  CSSViewEngineHooks.prototype.beforeCompile = function beforeCompile(content, resources, instruction) {
    if (instruction.targetShadowDOM) {
      _aureliaPal.DOM.injectStyles(this.css, content, true);
    } else if (_aureliaPal.FEATURE.scopedCSS) {
      var styleNode = _aureliaPal.DOM.injectStyles(this.css, content, true);
      styleNode.setAttribute('scoped', 'scoped');
    } else if (!this.owner._alreadyGloballyInjected) {
      _aureliaPal.DOM.injectStyles(this.css);
      this.owner._alreadyGloballyInjected = true;
    }
  };

  return CSSViewEngineHooks;
}();

function _createCSSResource(address) {
  var _dec11, _class7;

  var ViewCSS = (_dec11 = (0, _aureliaTemplating.resource)(new CSSResource(address)), _dec11(_class7 = function (_CSSViewEngineHooks) {
    _inherits(ViewCSS, _CSSViewEngineHooks);

    function ViewCSS() {
      _classCallCheck(this, ViewCSS);

      return _possibleConstructorReturn(this, _CSSViewEngineHooks.apply(this, arguments));
    }

    return ViewCSS;
  }(CSSViewEngineHooks)) || _class7);

  return ViewCSS;
}

var Compose = exports.Compose = (_dec12 = (0, _aureliaTemplating.customElement)('compose'), _dec13 = (0, _aureliaDependencyInjection.inject)(_aureliaPal.DOM.Element, _aureliaDependencyInjection.Container, _aureliaTemplating.CompositionEngine, _aureliaTemplating.ViewSlot, _aureliaTemplating.ViewResources, _aureliaTaskQueue.TaskQueue), _dec12(_class8 = (0, _aureliaTemplating.noView)(_class8 = _dec13(_class8 = (_class9 = function () {
  function Compose(element, container, compositionEngine, viewSlot, viewResources, taskQueue) {
    _classCallCheck(this, Compose);

    _initDefineProp(this, 'model', _descriptor, this);

    _initDefineProp(this, 'view', _descriptor2, this);

    _initDefineProp(this, 'viewModel', _descriptor3, this);

    this.element = element;
    this.container = container;
    this.compositionEngine = compositionEngine;
    this.viewSlot = viewSlot;
    this.viewResources = viewResources;
    this.taskQueue = taskQueue;
    this.currentController = null;
    this.currentViewModel = null;
  }

  Compose.prototype.created = function created(owningView) {
    this.owningView = owningView;
  };

  Compose.prototype.bind = function bind(bindingContext, overrideContext) {
    this.bindingContext = bindingContext;
    this.overrideContext = overrideContext;
    processInstruction(this, createInstruction(this, {
      view: this.view,
      viewModel: this.viewModel,
      model: this.model
    }));
  };

  Compose.prototype.unbind = function unbind(bindingContext, overrideContext) {
    this.bindingContext = null;
    this.overrideContext = null;
    var returnToCache = true;
    var skipAnimation = true;
    this.viewSlot.removeAll(returnToCache, skipAnimation);
  };

  Compose.prototype.modelChanged = function modelChanged(newValue, oldValue) {
    var _this9 = this;

    if (this.currentInstruction) {
      this.currentInstruction.model = newValue;
      return;
    }

    this.taskQueue.queueMicroTask(function () {
      if (_this9.currentInstruction) {
        _this9.currentInstruction.model = newValue;
        return;
      }

      var vm = _this9.currentViewModel;

      if (vm && typeof vm.activate === 'function') {
        vm.activate(newValue);
      }
    });
  };

  Compose.prototype.viewChanged = function viewChanged(newValue, oldValue) {
    var _this10 = this;

    var instruction = createInstruction(this, {
      view: newValue,
      viewModel: this.currentViewModel || this.viewModel,
      model: this.model
    });

    if (this.currentInstruction) {
      this.currentInstruction = instruction;
      return;
    }

    this.currentInstruction = instruction;
    this.taskQueue.queueMicroTask(function () {
      return processInstruction(_this10, _this10.currentInstruction);
    });
  };

  Compose.prototype.viewModelChanged = function viewModelChanged(newValue, oldValue) {
    var _this11 = this;

    var instruction = createInstruction(this, {
      viewModel: newValue,
      view: this.view,
      model: this.model
    });

    if (this.currentInstruction) {
      this.currentInstruction = instruction;
      return;
    }

    this.currentInstruction = instruction;
    this.taskQueue.queueMicroTask(function () {
      return processInstruction(_this11, _this11.currentInstruction);
    });
  };

  return Compose;
}(), (_descriptor = _applyDecoratedDescriptor(_class9.prototype, 'model', [_aureliaTemplating.bindable], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class9.prototype, 'view', [_aureliaTemplating.bindable], {
  enumerable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class9.prototype, 'viewModel', [_aureliaTemplating.bindable], {
  enumerable: true,
  initializer: null
})), _class9)) || _class8) || _class8) || _class8);


function createInstruction(composer, instruction) {
  return Object.assign(instruction, {
    bindingContext: composer.bindingContext,
    overrideContext: composer.overrideContext,
    owningView: composer.owningView,
    container: composer.container,
    viewSlot: composer.viewSlot,
    viewResources: composer.viewResources,
    currentController: composer.currentController,
    host: composer.element
  });
}

function processInstruction(composer, instruction) {
  composer.currentInstruction = null;
  composer.compositionEngine.compose(instruction).then(function (controller) {
    composer.currentController = controller;
    composer.currentViewModel = controller ? controller.viewModel : null;
  });
}

var BindingSignaler = exports.BindingSignaler = function () {
  function BindingSignaler() {
    _classCallCheck(this, BindingSignaler);

    this.signals = {};
  }

  BindingSignaler.prototype.signal = function signal(name) {
    var bindings = this.signals[name];
    if (!bindings) {
      return;
    }
    var i = bindings.length;
    while (i--) {
      bindings[i].call(_aureliaBinding.sourceContext);
    }
  };

  return BindingSignaler;
}();

var modeBindingBehavior = {
  bind: function bind(binding, source, lookupFunctions) {
    binding.originalMode = binding.mode;
    binding.mode = this.mode;
  },
  unbind: function unbind(binding, source) {
    binding.mode = binding.originalMode;
    binding.originalMode = null;
  }
};

var OneTimeBindingBehavior = exports.OneTimeBindingBehavior = (_dec14 = (0, _aureliaMetadata.mixin)(modeBindingBehavior), _dec14(_class12 = function OneTimeBindingBehavior() {
  _classCallCheck(this, OneTimeBindingBehavior);

  this.mode = _aureliaBinding.bindingMode.oneTime;
}) || _class12);
var OneWayBindingBehavior = exports.OneWayBindingBehavior = (_dec15 = (0, _aureliaMetadata.mixin)(modeBindingBehavior), _dec15(_class13 = function OneWayBindingBehavior() {
  _classCallCheck(this, OneWayBindingBehavior);

  this.mode = _aureliaBinding.bindingMode.oneWay;
}) || _class13);
var TwoWayBindingBehavior = exports.TwoWayBindingBehavior = (_dec16 = (0, _aureliaMetadata.mixin)(modeBindingBehavior), _dec16(_class14 = function TwoWayBindingBehavior() {
  _classCallCheck(this, TwoWayBindingBehavior);

  this.mode = _aureliaBinding.bindingMode.twoWay;
}) || _class14);
var aureliaHideClassName = exports.aureliaHideClassName = 'aurelia-hide';

var aureliaHideClass = '.' + aureliaHideClassName + ' { display:none !important; }';

function injectAureliaHideStyleAtHead() {
  _aureliaPal.DOM.injectStyles(aureliaHideClass);
}

function injectAureliaHideStyleAtBoundary(domBoundary) {
  if (_aureliaPal.FEATURE.shadowDOM && domBoundary && !domBoundary.hasAureliaHideStyle) {
    domBoundary.hasAureliaHideStyle = true;
    _aureliaPal.DOM.injectStyles(aureliaHideClass, domBoundary);
  }
}

var AttrBindingBehavior = exports.AttrBindingBehavior = function () {
  function AttrBindingBehavior() {
    _classCallCheck(this, AttrBindingBehavior);
  }

  AttrBindingBehavior.prototype.bind = function bind(binding, source) {
    binding.targetObserver = new _aureliaBinding.DataAttributeObserver(binding.target, binding.targetProperty);
  };

  AttrBindingBehavior.prototype.unbind = function unbind(binding, source) {};

  return AttrBindingBehavior;
}();

var lifecycleOptionalBehaviors = exports.lifecycleOptionalBehaviors = ['focus', 'if', 'repeat', 'show', 'with'];

function behaviorRequiresLifecycle(instruction) {
  var t = instruction.type;
  var name = t.elementName !== null ? t.elementName : t.attributeName;
  return lifecycleOptionalBehaviors.indexOf(name) === -1 && (t.handlesAttached || t.handlesBind || t.handlesCreated || t.handlesDetached || t.handlesUnbind) || t.viewFactory && viewsRequireLifecycle(t.viewFactory) || instruction.viewFactory && viewsRequireLifecycle(instruction.viewFactory);
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

var AbstractRepeater = exports.AbstractRepeater = function () {
  function AbstractRepeater(options) {
    _classCallCheck(this, AbstractRepeater);

    Object.assign(this, {
      local: 'items',
      viewsRequireLifecycle: true
    }, options);
  }

  AbstractRepeater.prototype.viewCount = function viewCount() {
    throw new Error('subclass must implement `viewCount`');
  };

  AbstractRepeater.prototype.views = function views() {
    throw new Error('subclass must implement `views`');
  };

  AbstractRepeater.prototype.view = function view(index) {
    throw new Error('subclass must implement `view`');
  };

  AbstractRepeater.prototype.matcher = function matcher() {
    throw new Error('subclass must implement `matcher`');
  };

  AbstractRepeater.prototype.addView = function addView(bindingContext, overrideContext) {
    throw new Error('subclass must implement `addView`');
  };

  AbstractRepeater.prototype.insertView = function insertView(index, bindingContext, overrideContext) {
    throw new Error('subclass must implement `insertView`');
  };

  AbstractRepeater.prototype.moveView = function moveView(sourceIndex, targetIndex) {
    throw new Error('subclass must implement `moveView`');
  };

  AbstractRepeater.prototype.removeAllViews = function removeAllViews(returnToCache, skipAnimation) {
    throw new Error('subclass must implement `removeAllViews`');
  };

  AbstractRepeater.prototype.removeViews = function removeViews(viewsToRemove, returnToCache, skipAnimation) {
    throw new Error('subclass must implement `removeView`');
  };

  AbstractRepeater.prototype.removeView = function removeView(index, returnToCache, skipAnimation) {
    throw new Error('subclass must implement `removeView`');
  };

  AbstractRepeater.prototype.updateBindings = function updateBindings(view) {
    throw new Error('subclass must implement `updateBindings`');
  };

  return AbstractRepeater;
}();

var ArrayRepeatStrategy = exports.ArrayRepeatStrategy = function () {
  function ArrayRepeatStrategy() {
    _classCallCheck(this, ArrayRepeatStrategy);
  }

  ArrayRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver(observerLocator, items) {
    return observerLocator.getArrayObserver(items);
  };

  ArrayRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, items) {
    var _this12 = this;

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
      (function () {
        var childrenSnapshot = children.slice(0);
        var itemNameInBindingContext = repeat.local;
        var matcher = repeat.matcher();

        var itemsPreviouslyInViews = [];
        var viewsToRemove = [];

        for (var index = 0; index < viewsLength; index++) {
          var view = childrenSnapshot[index];
          var oldItem = view.bindingContext[itemNameInBindingContext];

          if (indexOf(items, oldItem, matcher) === -1) {
            viewsToRemove.push(view);
          } else {
            itemsPreviouslyInViews.push(oldItem);
          }
        }

        var updateViews = void 0;
        var removePromise = void 0;

        if (itemsPreviouslyInViews.length > 0) {
          removePromise = repeat.removeViews(viewsToRemove, true, !repeat.viewsRequireLifecycle);
          updateViews = function updateViews() {
            for (var _index = 0; _index < itemsLength; _index++) {
              var item = items[_index];
              var indexOfView = indexOf(itemsPreviouslyInViews, item, matcher, _index);
              var _view = void 0;

              if (indexOfView === -1) {
                var overrideContext = createFullOverrideContext(repeat, items[_index], _index, itemsLength);
                repeat.insertView(_index, overrideContext.bindingContext, overrideContext);

                itemsPreviouslyInViews.splice(_index, 0, undefined);
              } else if (indexOfView === _index) {
                _view = children[indexOfView];
                itemsPreviouslyInViews[indexOfView] = undefined;
              } else {
                _view = children[indexOfView];
                repeat.moveView(indexOfView, _index);
                itemsPreviouslyInViews.splice(indexOfView, 1);
                itemsPreviouslyInViews.splice(_index, 0, undefined);
              }

              if (_view) {
                updateOverrideContext(_view.overrideContext, _index, itemsLength);
              }
            }

            _this12._inPlaceProcessItems(repeat, items);
          };
        } else {
          removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
          updateViews = function updateViews() {
            return _this12._standardProcessInstanceChanged(repeat, items);
          };
        }

        if (removePromise instanceof Promise) {
          removePromise.then(updateViews);
        } else {
          updateViews();
        }
      })();
    } else {
      this._inPlaceProcessItems(repeat, items);
    }
  };

  ArrayRepeatStrategy.prototype._standardProcessInstanceChanged = function _standardProcessInstanceChanged(repeat, items) {
    for (var i = 0, ii = items.length; i < ii; i++) {
      var overrideContext = createFullOverrideContext(repeat, items[i], i, ii);
      repeat.addView(overrideContext.bindingContext, overrideContext);
    }
  };

  ArrayRepeatStrategy.prototype._inPlaceProcessItems = function _inPlaceProcessItems(repeat, items) {
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

      if (view.bindingContext[local] === items[i] && view.overrideContext.$middle === middle && view.overrideContext.$last === last) {
        continue;
      }

      view.bindingContext[local] = items[i];
      view.overrideContext.$middle = middle;
      view.overrideContext.$last = last;
      repeat.updateBindings(view);
    }

    for (var _i = viewsLength; _i < itemsLength; _i++) {
      var overrideContext = createFullOverrideContext(repeat, items[_i], _i, itemsLength);
      repeat.addView(overrideContext.bindingContext, overrideContext);
    }
  };

  ArrayRepeatStrategy.prototype.instanceMutated = function instanceMutated(repeat, array, splices) {
    var _this13 = this;

    if (repeat.__queuedSplices) {
      for (var i = 0, ii = splices.length; i < ii; ++i) {
        var _splices$i = splices[i];
        var index = _splices$i.index;
        var removed = _splices$i.removed;
        var addedCount = _splices$i.addedCount;

        (0, _aureliaBinding.mergeSplice)(repeat.__queuedSplices, index, removed, addedCount);
      }

      repeat.__array = array.slice(0);
      return;
    }

    var maybePromise = this._runSplices(repeat, array.slice(0), splices);
    if (maybePromise instanceof Promise) {
      (function () {
        var queuedSplices = repeat.__queuedSplices = [];

        var runQueuedSplices = function runQueuedSplices() {
          if (!queuedSplices.length) {
            repeat.__queuedSplices = undefined;
            repeat.__array = undefined;
            return;
          }

          var nextPromise = _this13._runSplices(repeat, repeat.__array, queuedSplices) || Promise.resolve();
          queuedSplices = repeat.__queuedSplices = [];
          nextPromise.then(runQueuedSplices);
        };

        maybePromise.then(runQueuedSplices);
      })();
    }
  };

  ArrayRepeatStrategy.prototype._runSplices = function _runSplices(repeat, array, splices) {
    var _this14 = this;

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
        var spliceIndexLow = _this14._handleAddedSplices(repeat, array, splices);
        updateOverrideContexts(repeat.views(), spliceIndexLow);
      });
    }

    var spliceIndexLow = this._handleAddedSplices(repeat, array, splices);
    updateOverrideContexts(repeat.views(), spliceIndexLow);

    return undefined;
  };

  ArrayRepeatStrategy.prototype._handleAddedSplices = function _handleAddedSplices(repeat, array, splices) {
    var spliceIndex = void 0;
    var spliceIndexLow = void 0;
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
}();

var MapRepeatStrategy = exports.MapRepeatStrategy = function () {
  function MapRepeatStrategy() {
    _classCallCheck(this, MapRepeatStrategy);
  }

  MapRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver(observerLocator, items) {
    return observerLocator.getMapObserver(items);
  };

  MapRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, items) {
    var _this15 = this;

    var removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
    if (removePromise instanceof Promise) {
      removePromise.then(function () {
        return _this15._standardProcessItems(repeat, items);
      });
      return;
    }
    this._standardProcessItems(repeat, items);
  };

  MapRepeatStrategy.prototype._standardProcessItems = function _standardProcessItems(repeat, items) {
    var index = 0;
    var overrideContext = void 0;

    items.forEach(function (value, key) {
      overrideContext = createFullOverrideContext(repeat, value, index, items.size, key);
      repeat.addView(overrideContext.bindingContext, overrideContext);
      ++index;
    });
  };

  MapRepeatStrategy.prototype.instanceMutated = function instanceMutated(repeat, map, records) {
    var key = void 0;
    var i = void 0;
    var ii = void 0;
    var overrideContext = void 0;
    var removeIndex = void 0;
    var record = void 0;
    var rmPromises = [];
    var viewOrPromise = void 0;

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
          overrideContext = createFullOverrideContext(repeat, map.get(key), map.size - 1, map.size, key);
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
    } else {
      updateOverrideContexts(repeat.views(), 0);
    }
  };

  MapRepeatStrategy.prototype._getViewIndexByKey = function _getViewIndexByKey(repeat, key) {
    var i = void 0;
    var ii = void 0;
    var child = void 0;

    for (i = 0, ii = repeat.viewCount(); i < ii; ++i) {
      child = repeat.view(i);
      if (child.bindingContext[repeat.key] === key) {
        return i;
      }
    }

    return undefined;
  };

  return MapRepeatStrategy;
}();

var NumberRepeatStrategy = exports.NumberRepeatStrategy = function () {
  function NumberRepeatStrategy() {
    _classCallCheck(this, NumberRepeatStrategy);
  }

  NumberRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver() {
    return null;
  };

  NumberRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, value) {
    var _this16 = this;

    var removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
    if (removePromise instanceof Promise) {
      removePromise.then(function () {
        return _this16._standardProcessItems(repeat, value);
      });
      return;
    }
    this._standardProcessItems(repeat, value);
  };

  NumberRepeatStrategy.prototype._standardProcessItems = function _standardProcessItems(repeat, value) {
    var childrenLength = repeat.viewCount();
    var i = void 0;
    var ii = void 0;
    var overrideContext = void 0;
    var viewsToRemove = void 0;

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
}();

var SetRepeatStrategy = exports.SetRepeatStrategy = function () {
  function SetRepeatStrategy() {
    _classCallCheck(this, SetRepeatStrategy);
  }

  SetRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver(observerLocator, items) {
    return observerLocator.getSetObserver(items);
  };

  SetRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, items) {
    var _this17 = this;

    var removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
    if (removePromise instanceof Promise) {
      removePromise.then(function () {
        return _this17._standardProcessItems(repeat, items);
      });
      return;
    }
    this._standardProcessItems(repeat, items);
  };

  SetRepeatStrategy.prototype._standardProcessItems = function _standardProcessItems(repeat, items) {
    var index = 0;
    var overrideContext = void 0;

    items.forEach(function (value) {
      overrideContext = createFullOverrideContext(repeat, value, index, items.size);
      repeat.addView(overrideContext.bindingContext, overrideContext);
      ++index;
    });
  };

  SetRepeatStrategy.prototype.instanceMutated = function instanceMutated(repeat, set, records) {
    var value = void 0;
    var i = void 0;
    var ii = void 0;
    var overrideContext = void 0;
    var removeIndex = void 0;
    var record = void 0;
    var rmPromises = [];
    var viewOrPromise = void 0;

    for (i = 0, ii = records.length; i < ii; ++i) {
      record = records[i];
      value = record.value;
      switch (record.type) {
        case 'add':
          overrideContext = createFullOverrideContext(repeat, value, set.size - 1, set.size);
          repeat.insertView(set.size - 1, overrideContext.bindingContext, overrideContext);
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
    } else {
      updateOverrideContexts(repeat.views(), 0);
    }
  };

  SetRepeatStrategy.prototype._getViewIndexByValue = function _getViewIndexByValue(repeat, value) {
    var i = void 0;
    var ii = void 0;
    var child = void 0;

    for (i = 0, ii = repeat.viewCount(); i < ii; ++i) {
      child = repeat.view(i);
      if (child.bindingContext[repeat.local] === value) {
        return i;
      }
    }

    return undefined;
  };

  return SetRepeatStrategy;
}();

var SanitizeHTMLValueConverter = exports.SanitizeHTMLValueConverter = (_dec17 = (0, _aureliaBinding.valueConverter)('sanitizeHTML'), _dec18 = (0, _aureliaDependencyInjection.inject)(HTMLSanitizer), _dec17(_class15 = _dec18(_class15 = function () {
  function SanitizeHTMLValueConverter(sanitizer) {
    _classCallCheck(this, SanitizeHTMLValueConverter);

    this.sanitizer = sanitizer;
  }

  SanitizeHTMLValueConverter.prototype.toView = function toView(untrustedMarkup) {
    if (untrustedMarkup === null || untrustedMarkup === undefined) {
      return null;
    }

    return this.sanitizer.sanitize(untrustedMarkup);
  };

  return SanitizeHTMLValueConverter;
}()) || _class15) || _class15);
function getElementName(address) {
  return (/([^\/^\?]+)\.html/i.exec(address)[1].toLowerCase()
  );
}

function configure(config) {
  var viewEngine = config.container.get(_aureliaTemplating.ViewEngine);
  var loader = config.aurelia.loader;

  viewEngine.addResourcePlugin('.html', {
    'fetch': function fetch(address) {
      return loader.loadTemplate(address).then(function (registryEntry) {
        var _ref;

        var bindable = registryEntry.template.getAttribute('bindable');
        var elementName = getElementName(address);

        if (bindable) {
          bindable = bindable.split(',').map(function (x) {
            return x.trim();
          });
          registryEntry.template.removeAttribute('bindable');
        } else {
          bindable = [];
        }

        return _ref = {}, _ref[elementName] = _createDynamicElement(elementName, address, bindable), _ref;
      });
    }
  });
}

var SignalBindingBehavior = exports.SignalBindingBehavior = function () {
  SignalBindingBehavior.inject = function inject() {
    return [BindingSignaler];
  };

  function SignalBindingBehavior(bindingSignaler) {
    _classCallCheck(this, SignalBindingBehavior);

    this.signals = bindingSignaler.signals;
  }

  SignalBindingBehavior.prototype.bind = function bind(binding, source) {
    if (!binding.updateTarget) {
      throw new Error('Only property bindings and string interpolation bindings can be signaled.  Trigger, delegate and call bindings cannot be signaled.');
    }
    if (arguments.length === 3) {
      var name = arguments[2];
      var bindings = this.signals[name] || (this.signals[name] = []);
      bindings.push(binding);
      binding.signalName = name;
    } else if (arguments.length > 3) {
      var names = Array.prototype.slice.call(arguments, 2);
      var i = names.length;
      while (i--) {
        var _name = names[i];
        var _bindings = this.signals[_name] || (this.signals[_name] = []);
        _bindings.push(binding);
      }
      binding.signalName = names;
    } else {
      throw new Error('Signal name is required.');
    }
  };

  SignalBindingBehavior.prototype.unbind = function unbind(binding, source) {
    var name = binding.signalName;
    binding.signalName = null;
    if (Array.isArray(name)) {
      var names = name;
      var i = names.length;
      while (i--) {
        var n = names[i];
        var bindings = this.signals[n];
        bindings.splice(bindings.indexOf(binding), 1);
      }
    } else {
      var _bindings2 = this.signals[name];
      _bindings2.splice(_bindings2.indexOf(binding), 1);
    }
  };

  return SignalBindingBehavior;
}();

var Hide = exports.Hide = (_dec19 = (0, _aureliaTemplating.customAttribute)('hide'), _dec20 = (0, _aureliaDependencyInjection.inject)(_aureliaPal.DOM.Element, _aureliaTemplating.Animator, _aureliaDependencyInjection.Optional.of(_aureliaPal.DOM.boundary, true)), _dec19(_class17 = _dec20(_class17 = function () {
  function Hide(element, animator, domBoundary) {
    _classCallCheck(this, Hide);

    this.element = element;
    this.animator = animator;
    this.domBoundary = domBoundary;
  }

  Hide.prototype.created = function created() {
    injectAureliaHideStyleAtBoundary(this.domBoundary);
  };

  Hide.prototype.valueChanged = function valueChanged(newValue) {
    if (newValue) {
      this.animator.addClass(this.element, aureliaHideClassName);
    } else {
      this.animator.removeClass(this.element, aureliaHideClassName);
    }
  };

  Hide.prototype.bind = function bind(bindingContext) {
    this.valueChanged(this.value);
  };

  return Hide;
}()) || _class17) || _class17);
var Show = exports.Show = (_dec21 = (0, _aureliaTemplating.customAttribute)('show'), _dec22 = (0, _aureliaDependencyInjection.inject)(_aureliaPal.DOM.Element, _aureliaTemplating.Animator, _aureliaDependencyInjection.Optional.of(_aureliaPal.DOM.boundary, true)), _dec21(_class18 = _dec22(_class18 = function () {
  function Show(element, animator, domBoundary) {
    _classCallCheck(this, Show);

    this.element = element;
    this.animator = animator;
    this.domBoundary = domBoundary;
  }

  Show.prototype.created = function created() {
    injectAureliaHideStyleAtBoundary(this.domBoundary);
  };

  Show.prototype.valueChanged = function valueChanged(newValue) {
    if (newValue) {
      this.animator.removeClass(this.element, aureliaHideClassName);
    } else {
      this.animator.addClass(this.element, aureliaHideClassName);
    }
  };

  Show.prototype.bind = function bind(bindingContext) {
    this.valueChanged(this.value);
  };

  return Show;
}()) || _class18) || _class18);

var RepeatStrategyLocator = exports.RepeatStrategyLocator = function () {
  function RepeatStrategyLocator() {
    _classCallCheck(this, RepeatStrategyLocator);

    this.matchers = [];
    this.strategies = [];

    this.addStrategy(function (items) {
      return items === null || items === undefined;
    }, new NullRepeatStrategy());
    this.addStrategy(function (items) {
      return items instanceof Array;
    }, new ArrayRepeatStrategy());
    this.addStrategy(function (items) {
      return items instanceof Map;
    }, new MapRepeatStrategy());
    this.addStrategy(function (items) {
      return items instanceof Set;
    }, new SetRepeatStrategy());
    this.addStrategy(function (items) {
      return typeof items === 'number';
    }, new NumberRepeatStrategy());
  }

  RepeatStrategyLocator.prototype.addStrategy = function addStrategy(matcher, strategy) {
    this.matchers.push(matcher);
    this.strategies.push(strategy);
  };

  RepeatStrategyLocator.prototype.getStrategy = function getStrategy(items) {
    var matchers = this.matchers;

    for (var i = 0, ii = matchers.length; i < ii; ++i) {
      if (matchers[i](items)) {
        return this.strategies[i];
      }
    }

    return null;
  };

  return RepeatStrategyLocator;
}();

var Repeat = exports.Repeat = (_dec23 = (0, _aureliaTemplating.customAttribute)('repeat'), _dec24 = (0, _aureliaDependencyInjection.inject)(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.TargetInstruction, _aureliaTemplating.ViewSlot, _aureliaTemplating.ViewResources, _aureliaBinding.ObserverLocator, RepeatStrategyLocator), _dec23(_class19 = (0, _aureliaTemplating.templateController)(_class19 = _dec24(_class19 = (_class20 = function (_AbstractRepeater) {
  _inherits(Repeat, _AbstractRepeater);

  function Repeat(viewFactory, instruction, viewSlot, viewResources, observerLocator, strategyLocator) {
    _classCallCheck(this, Repeat);

    var _this18 = _possibleConstructorReturn(this, _AbstractRepeater.call(this, {
      local: 'item',
      viewsRequireLifecycle: viewsRequireLifecycle(viewFactory)
    }));

    _initDefineProp(_this18, 'items', _descriptor4, _this18);

    _initDefineProp(_this18, 'local', _descriptor5, _this18);

    _initDefineProp(_this18, 'key', _descriptor6, _this18);

    _initDefineProp(_this18, 'value', _descriptor7, _this18);

    _this18.viewFactory = viewFactory;
    _this18.instruction = instruction;
    _this18.viewSlot = viewSlot;
    _this18.lookupFunctions = viewResources.lookupFunctions;
    _this18.observerLocator = observerLocator;
    _this18.key = 'key';
    _this18.value = 'value';
    _this18.strategyLocator = strategyLocator;
    _this18.ignoreMutation = false;
    _this18.sourceExpression = getItemsSourceExpression(_this18.instruction, 'repeat.for');
    _this18.isOneTime = isOneTime(_this18.sourceExpression);
    _this18.viewsRequireLifecycle = viewsRequireLifecycle(viewFactory);
    return _this18;
  }

  Repeat.prototype.call = function call(context, changes) {
    this[context](this.items, changes);
  };

  Repeat.prototype.bind = function bind(bindingContext, overrideContext) {
    this.scope = { bindingContext: bindingContext, overrideContext: overrideContext };
    this.matcherBinding = this._captureAndRemoveMatcherBinding();
    this.itemsChanged();
  };

  Repeat.prototype.unbind = function unbind() {
    this.scope = null;
    this.items = null;
    this.matcherBinding = null;
    this.viewSlot.removeAll(true);
    this._unsubscribeCollection();
  };

  Repeat.prototype._unsubscribeCollection = function _unsubscribeCollection() {
    if (this.collectionObserver) {
      this.collectionObserver.unsubscribe(this.callContext, this);
      this.collectionObserver = null;
      this.callContext = null;
    }
  };

  Repeat.prototype.itemsChanged = function itemsChanged() {
    this._unsubscribeCollection();

    if (!this.scope) {
      return;
    }

    var items = this.items;
    this.strategy = this.strategyLocator.getStrategy(items);
    if (!this.strategy) {
      throw new Error('Value for \'' + this.sourceExpression + '\' is non-repeatable');
    }

    if (!this.isOneTime && !this._observeInnerCollection()) {
      this._observeCollection();
    }
    this.strategy.instanceChanged(this, items);
  };

  Repeat.prototype._getInnerCollection = function _getInnerCollection() {
    var expression = unwrapExpression(this.sourceExpression);
    if (!expression) {
      return null;
    }
    return expression.evaluate(this.scope, null);
  };

  Repeat.prototype.handleCollectionMutated = function handleCollectionMutated(collection, changes) {
    if (!this.collectionObserver) {
      return;
    }
    this.strategy.instanceMutated(this, collection, changes);
  };

  Repeat.prototype.handleInnerCollectionMutated = function handleInnerCollectionMutated(collection, changes) {
    var _this19 = this;

    if (!this.collectionObserver) {
      return;
    }

    if (this.ignoreMutation) {
      return;
    }
    this.ignoreMutation = true;
    var newItems = this.sourceExpression.evaluate(this.scope, this.lookupFunctions);
    this.observerLocator.taskQueue.queueMicroTask(function () {
      return _this19.ignoreMutation = false;
    });

    if (newItems === this.items) {
      this.itemsChanged();
    } else {
      this.items = newItems;
    }
  };

  Repeat.prototype._observeInnerCollection = function _observeInnerCollection() {
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

  Repeat.prototype._observeCollection = function _observeCollection() {
    var items = this.items;
    this.collectionObserver = this.strategy.getCollectionObserver(this.observerLocator, items);
    if (this.collectionObserver) {
      this.callContext = 'handleCollectionMutated';
      this.collectionObserver.subscribe(this.callContext, this);
    }
  };

  Repeat.prototype._captureAndRemoveMatcherBinding = function _captureAndRemoveMatcherBinding() {
    if (this.viewFactory.viewFactory) {
      var instructions = this.viewFactory.viewFactory.instructions;
      var instructionIds = Object.keys(instructions);
      for (var i = 0; i < instructionIds.length; i++) {
        var expressions = instructions[instructionIds[i]].expressions;
        if (expressions) {
          for (var ii = 0; i < expressions.length; i++) {
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

  Repeat.prototype.viewCount = function viewCount() {
    return this.viewSlot.children.length;
  };

  Repeat.prototype.views = function views() {
    return this.viewSlot.children;
  };

  Repeat.prototype.view = function view(index) {
    return this.viewSlot.children[index];
  };

  Repeat.prototype.matcher = function matcher() {
    return this.matcherBinding ? this.matcherBinding.sourceExpression.evaluate(this.scope, this.matcherBinding.lookupFunctions) : null;
  };

  Repeat.prototype.addView = function addView(bindingContext, overrideContext) {
    var view = this.viewFactory.create();
    view.bind(bindingContext, overrideContext);
    this.viewSlot.add(view);
  };

  Repeat.prototype.insertView = function insertView(index, bindingContext, overrideContext) {
    var view = this.viewFactory.create();
    view.bind(bindingContext, overrideContext);
    this.viewSlot.insert(index, view);
  };

  Repeat.prototype.moveView = function moveView(sourceIndex, targetIndex) {
    this.viewSlot.move(sourceIndex, targetIndex);
  };

  Repeat.prototype.removeAllViews = function removeAllViews(returnToCache, skipAnimation) {
    return this.viewSlot.removeAll(returnToCache, skipAnimation);
  };

  Repeat.prototype.removeViews = function removeViews(viewsToRemove, returnToCache, skipAnimation) {
    return this.viewSlot.removeMany(viewsToRemove, returnToCache, skipAnimation);
  };

  Repeat.prototype.removeView = function removeView(index, returnToCache, skipAnimation) {
    return this.viewSlot.removeAt(index, returnToCache, skipAnimation);
  };

  Repeat.prototype.updateBindings = function updateBindings(view) {
    var j = view.bindings.length;
    while (j--) {
      updateOneTimeBinding(view.bindings[j]);
    }
    j = view.controllers.length;
    while (j--) {
      var k = view.controllers[j].boundProperties.length;
      while (k--) {
        var binding = view.controllers[j].boundProperties[k].binding;
        updateOneTimeBinding(binding);
      }
    }
  };

  return Repeat;
}(AbstractRepeater), (_descriptor4 = _applyDecoratedDescriptor(_class20.prototype, 'items', [_aureliaTemplating.bindable], {
  enumerable: true,
  initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class20.prototype, 'local', [_aureliaTemplating.bindable], {
  enumerable: true,
  initializer: null
}), _descriptor6 = _applyDecoratedDescriptor(_class20.prototype, 'key', [_aureliaTemplating.bindable], {
  enumerable: true,
  initializer: null
}), _descriptor7 = _applyDecoratedDescriptor(_class20.prototype, 'value', [_aureliaTemplating.bindable], {
  enumerable: true,
  initializer: null
})), _class20)) || _class19) || _class19) || _class19);