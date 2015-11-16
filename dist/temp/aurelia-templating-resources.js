'use strict';

exports.__esModule = true;

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports._createCSSResource = _createCSSResource;
exports._createDynamicElement = _createDynamicElement;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _aureliaLogging = require('aurelia-logging');

var LogManager = _interopRequireWildcard(_aureliaLogging);

var _aureliaBinding = require('aurelia-binding');

var _aureliaTemplating = require('aurelia-templating');

var _aureliaLoader = require('aurelia-loader');

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaPath = require('aurelia-path');

var _aureliaPal = require('aurelia-pal');

var _aureliaTaskQueue = require('aurelia-task-queue');

var eventNamesRequired = 'The updateTrigger binding behavior requires at least one event name argument: eg <input value.bind="firstName & updateTrigger:\'blur\'">';
var notApplicableMessage = 'The updateTrigger binding behavior can only be applied to two-way bindings on input/select elements.';

var UpdateTriggerBindingBehavior = (function () {
  _createClass(UpdateTriggerBindingBehavior, null, [{
    key: 'inject',
    value: [_aureliaBinding.EventManager],
    enumerable: true
  }]);

  function UpdateTriggerBindingBehavior(eventManager) {
    _classCallCheck(this, UpdateTriggerBindingBehavior);

    this.eventManager = eventManager;
  }

  UpdateTriggerBindingBehavior.prototype.bind = function bind(binding, source) {
    for (var _len = arguments.length, events = Array(_len > 2 ? _len - 2 : 0), _key2 = 2; _key2 < _len; _key2++) {
      events[_key2 - 2] = arguments[_key2];
    }

    if (events.length === 0) {
      throw new Error(eventNamesRequired);
    }
    if (binding.mode !== _aureliaBinding.bindingMode.twoWay || !binding.targetProperty.handler) {
      throw new Error(notApplicableMessage);
    }

    binding.targetProperty.originalHandler = binding.targetProperty.handler;

    var handler = this.eventManager.createElementHandler(events);
    binding.targetProperty.handler = handler;
  };

  UpdateTriggerBindingBehavior.prototype.unbind = function unbind(binding, source) {
    binding.targetProperty.handler = binding.targetProperty.originalHandler;
    binding.targetProperty.originalHandler = null;
  };

  return UpdateTriggerBindingBehavior;
})();

exports.UpdateTriggerBindingBehavior = UpdateTriggerBindingBehavior;

var BindingSignaler = (function () {
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
})();

exports.BindingSignaler = BindingSignaler;

function debounce(newValue) {
  var _this = this;

  var state = this.debounceState;
  if (state.immediate) {
    state.immediate = false;
    this.debouncedMethod(newValue);
    return;
  }
  clearTimeout(state.timeoutId);
  state.timeoutId = setTimeout(function () {
    return _this.debouncedMethod(newValue);
  }, state.delay);
}

var DebounceBindingBehavior = (function () {
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
})();

exports.DebounceBindingBehavior = DebounceBindingBehavior;

function throttle(newValue) {
  var _this2 = this;

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
      _this2.throttledMethod(state.newValue);
    }, state.delay - elapsed);
  }
}

var ThrottleBindingBehavior = (function () {
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
})();

exports.ThrottleBindingBehavior = ThrottleBindingBehavior;

var ModeBindingBehavior = (function () {
  function ModeBindingBehavior(mode) {
    _classCallCheck(this, ModeBindingBehavior);

    this.mode = mode;
  }

  ModeBindingBehavior.prototype.bind = function bind(binding, source, lookupFunctions) {
    binding.originalMode = binding.mode;
    binding.mode = this.mode;
  };

  ModeBindingBehavior.prototype.unbind = function unbind(binding, source) {
    binding.mode = binding.originalMode;
    binding.originalMode = null;
  };

  return ModeBindingBehavior;
})();

var OneTimeBindingBehavior = (function (_ModeBindingBehavior) {
  _inherits(OneTimeBindingBehavior, _ModeBindingBehavior);

  function OneTimeBindingBehavior() {
    _classCallCheck(this, OneTimeBindingBehavior);

    _ModeBindingBehavior.call(this, _aureliaBinding.bindingMode.oneTime);
  }

  return OneTimeBindingBehavior;
})(ModeBindingBehavior);

exports.OneTimeBindingBehavior = OneTimeBindingBehavior;

var OneWayBindingBehavior = (function (_ModeBindingBehavior2) {
  _inherits(OneWayBindingBehavior, _ModeBindingBehavior2);

  function OneWayBindingBehavior() {
    _classCallCheck(this, OneWayBindingBehavior);

    _ModeBindingBehavior2.call(this, _aureliaBinding.bindingMode.oneWay);
  }

  return OneWayBindingBehavior;
})(ModeBindingBehavior);

exports.OneWayBindingBehavior = OneWayBindingBehavior;

var TwoWayBindingBehavior = (function (_ModeBindingBehavior3) {
  _inherits(TwoWayBindingBehavior, _ModeBindingBehavior3);

  function TwoWayBindingBehavior() {
    _classCallCheck(this, TwoWayBindingBehavior);

    _ModeBindingBehavior3.call(this, _aureliaBinding.bindingMode.twoWay);
  }

  return TwoWayBindingBehavior;
})(ModeBindingBehavior);

exports.TwoWayBindingBehavior = TwoWayBindingBehavior;

var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

var HTMLSanitizer = (function () {
  function HTMLSanitizer() {
    _classCallCheck(this, HTMLSanitizer);
  }

  HTMLSanitizer.prototype.sanitize = function sanitize(input) {
    return input.replace(SCRIPT_REGEX, '');
  };

  return HTMLSanitizer;
})();

exports.HTMLSanitizer = HTMLSanitizer;

var cssUrlMatcher = /url\((?!['"]data)([^)]+)\)/gi;

function fixupCSSUrls(address, css) {
  return css.replace(cssUrlMatcher, function (match, p1) {
    var quote = p1.charAt(0);
    if (quote === '\'' || quote === '"') {
      p1 = p1.substr(1, p1.length - 2);
    }
    return 'url(\'' + _aureliaPath.relativeToFile(p1, address) + '\')';
  });
}

var CSSResource = (function () {
  function CSSResource(address) {
    _classCallCheck(this, CSSResource);

    this.address = address;
    this._global = null;
    this._scoped = null;
  }

  CSSResource.prototype.initialize = function initialize(container, target) {
    this._global = new target('global');
    this._scoped = new target('scoped');
  };

  CSSResource.prototype.register = function register(registry, name) {
    registry.registerViewEngineHooks(name === 'scoped' ? this._scoped : this._global);
  };

  CSSResource.prototype.load = function load(container) {
    var _this3 = this;

    return container.get(_aureliaLoader.Loader).loadText(this.address).then(function (text) {
      text = fixupCSSUrls(_this3.address, text);
      _this3._global.css = text;
      _this3._scoped.css = text;
    });
  };

  return CSSResource;
})();

var CSSViewEngineHooks = (function () {
  function CSSViewEngineHooks(mode) {
    _classCallCheck(this, CSSViewEngineHooks);

    this.mode = mode;
    this.css = null;
    this._alreadyGloballyInjected = false;
  }

  CSSViewEngineHooks.prototype.beforeCompile = function beforeCompile(content, resources, instruction) {
    if (this.mode === 'scoped') {
      if (instruction.targetShadowDOM) {
        _aureliaPal.DOM.injectStyles(this.css, content, true);
      } else if (_aureliaPal.FEATURE.scopedCSS) {
        var styleNode = _aureliaPal.DOM.injectStyles(this.css, content, true);
        styleNode.setAttribute('scoped', 'scoped');
      } else if (!this._alreadyGloballyInjected) {
        _aureliaPal.DOM.injectStyles(this.css);
        this._alreadyGloballyInjected = true;
      }
    } else if (!this._alreadyGloballyInjected) {
      _aureliaPal.DOM.injectStyles(this.css);
      this._alreadyGloballyInjected = true;
    }
  };

  return CSSViewEngineHooks;
})();

function _createCSSResource(address) {
  var ViewCSS = (function (_CSSViewEngineHooks) {
    _inherits(ViewCSS, _CSSViewEngineHooks);

    function ViewCSS() {
      _classCallCheck(this, _ViewCSS);

      _CSSViewEngineHooks.apply(this, arguments);
    }

    var _ViewCSS = ViewCSS;
    ViewCSS = _aureliaTemplating.resource(new CSSResource(address))(ViewCSS) || ViewCSS;
    return ViewCSS;
  })(CSSViewEngineHooks);

  return ViewCSS;
}

function _createDynamicElement(name, viewUrl, bindableNames) {
  var DynamicElement = (function () {
    function DynamicElement() {
      _classCallCheck(this, _DynamicElement);
    }

    DynamicElement.prototype.bind = function bind(bindingContext) {
      this.$parent = bindingContext;
    };

    var _DynamicElement = DynamicElement;
    DynamicElement = _aureliaTemplating.useView(viewUrl)(DynamicElement) || DynamicElement;
    DynamicElement = _aureliaTemplating.customElement(name)(DynamicElement) || DynamicElement;
    return DynamicElement;
  })();

  for (var i = 0, ii = bindableNames.length; i < ii; ++i) {
    _aureliaTemplating.bindable(bindableNames[i])(DynamicElement);
  }
  return DynamicElement;
}

var ViewSpy = (function () {
  function ViewSpy() {
    _classCallCheck(this, _ViewSpy);

    this.logger = LogManager.getLogger('view-spy');
  }

  ViewSpy.prototype._log = function _log(lifecycleName, context) {
    if (!this.value && lifecycleName === 'created') {
      this.logger.info(lifecycleName, this.view);
    } else if (this.value && this.value.indexOf(lifecycleName) !== -1) {
      this.logger.info(lifecycleName, this.view, context);
    }
  };

  ViewSpy.prototype.created = function created(view) {
    this.view = view;
    this._log('created');
  };

  ViewSpy.prototype.bind = function bind(bindingContext) {
    this._log('bind', bindingContext);
  };

  ViewSpy.prototype.attached = function attached() {
    this._log('attached');
  };

  ViewSpy.prototype.detached = function detached() {
    this._log('detached');
  };

  ViewSpy.prototype.unbind = function unbind() {
    this._log('unbind');
  };

  var _ViewSpy = ViewSpy;
  ViewSpy = _aureliaTemplating.customAttribute('view-spy')(ViewSpy) || ViewSpy;
  return ViewSpy;
})();

exports.ViewSpy = ViewSpy;

var CompileSpy = (function () {
  function CompileSpy(element, instruction) {
    _classCallCheck(this, _CompileSpy);

    LogManager.getLogger('compile-spy').info(element, instruction);
  }

  var _CompileSpy = CompileSpy;
  CompileSpy = _aureliaDependencyInjection.inject(_aureliaPal.DOM.Element, _aureliaTemplating.TargetInstruction)(CompileSpy) || CompileSpy;
  CompileSpy = _aureliaTemplating.customAttribute('compile-spy')(CompileSpy) || CompileSpy;
  return CompileSpy;
})();

exports.CompileSpy = CompileSpy;

var Focus = (function () {
  function Focus(element, taskQueue) {
    var _this4 = this;

    _classCallCheck(this, _Focus);

    this.element = element;
    this.taskQueue = taskQueue;

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
    if (newValue) {
      this._giveFocus();
    } else {
      this.element.blur();
    }
  };

  Focus.prototype._giveFocus = function _giveFocus() {
    var _this5 = this;

    this.taskQueue.queueMicroTask(function () {
      if (_this5.value) {
        _this5.element.focus();
      }
    });
  };

  Focus.prototype.attached = function attached() {
    this.element.addEventListener('focus', this.focusListener);
    this.element.addEventListener('blur', this.blurListener);
  };

  Focus.prototype.detached = function detached() {
    this.element.removeEventListener('focus', this.focusListener);
    this.element.removeEventListener('blur', this.blurListener);
  };

  var _Focus = Focus;
  Focus = _aureliaDependencyInjection.inject(_aureliaPal.DOM.Element, _aureliaTaskQueue.TaskQueue)(Focus) || Focus;
  Focus = _aureliaTemplating.customAttribute('focus', _aureliaBinding.bindingMode.twoWay)(Focus) || Focus;
  return Focus;
})();

exports.Focus = Focus;

var Replaceable = (function () {
  function Replaceable(viewFactory, viewSlot) {
    _classCallCheck(this, _Replaceable);

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

  var _Replaceable = Replaceable;
  Replaceable = _aureliaDependencyInjection.inject(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.ViewSlot)(Replaceable) || Replaceable;
  Replaceable = _aureliaTemplating.templateController(Replaceable) || Replaceable;
  Replaceable = _aureliaTemplating.customAttribute('replaceable')(Replaceable) || Replaceable;
  return Replaceable;
})();

exports.Replaceable = Replaceable;

var Show = (function () {
  function Show(element, animator) {
    _classCallCheck(this, _Show);

    this.element = element;
    this.animator = animator;
  }

  Show.prototype.valueChanged = function valueChanged(newValue) {
    if (newValue) {
      this.animator.removeClass(this.element, 'aurelia-hide');
    } else {
      this.animator.addClass(this.element, 'aurelia-hide');
    }
  };

  Show.prototype.bind = function bind(bindingContext) {
    this.valueChanged(this.value);
  };

  var _Show = Show;
  Show = _aureliaDependencyInjection.inject(_aureliaPal.DOM.Element, _aureliaTemplating.Animator)(Show) || Show;
  Show = _aureliaTemplating.customAttribute('show')(Show) || Show;
  return Show;
})();

exports.Show = Show;

var With = (function () {
  function With(viewFactory, viewSlot) {
    _classCallCheck(this, _With);

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
    var overrideContext = _aureliaBinding.createOverrideContext(newValue, this.parentOverrideContext);
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

  var _With = With;
  With = _aureliaDependencyInjection.inject(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.ViewSlot)(With) || With;
  With = _aureliaTemplating.templateController(With) || With;
  With = _aureliaTemplating.customAttribute('with')(With) || With;
  return With;
})();

exports.With = With;

var If = (function () {
  function If(viewFactory, viewSlot, taskQueue) {
    _classCallCheck(this, _If);

    this.viewFactory = viewFactory;
    this.viewSlot = viewSlot;
    this.showing = false;
    this.taskQueue = taskQueue;
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
    var _this6 = this;

    if (!newValue) {
      if (this.view !== null && this.showing) {
        this.taskQueue.queueMicroTask(function () {
          var viewOrPromise = _this6.viewSlot.remove(_this6.view);
          if (viewOrPromise instanceof Promise) {
            viewOrPromise.then(function () {
              return _this6.view.unbind();
            });
          } else {
            _this6.view.unbind();
          }
        });
      }

      this.showing = false;
      return;
    }

    if (this.view === null) {
      this.view = this.viewFactory.create();
    }

    if (!this.view.isBound) {
      this.view.bind(this.bindingContext, this.overrideContext);
    }

    if (!this.showing) {
      this.showing = true;
      this.viewSlot.add(this.view);
    }
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

  var _If = If;
  If = _aureliaDependencyInjection.inject(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.ViewSlot, _aureliaTaskQueue.TaskQueue)(If) || If;
  If = _aureliaTemplating.templateController(If) || If;
  If = _aureliaTemplating.customAttribute('if')(If) || If;
  return If;
})();

exports.If = If;

var Compose = (function () {
  var _instanceInitializers = {};

  _createDecoratedClass(Compose, [{
    key: 'model',
    decorators: [_aureliaTemplating.bindable],
    initializer: null,
    enumerable: true
  }, {
    key: 'view',
    decorators: [_aureliaTemplating.bindable],
    initializer: null,
    enumerable: true
  }, {
    key: 'viewModel',
    decorators: [_aureliaTemplating.bindable],
    initializer: null,
    enumerable: true
  }], null, _instanceInitializers);

  function Compose(element, container, compositionEngine, viewSlot, viewResources, taskQueue) {
    _classCallCheck(this, _Compose);

    _defineDecoratedPropertyDescriptor(this, 'model', _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, 'view', _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, 'viewModel', _instanceInitializers);

    this.element = element;
    this.container = container;
    this.compositionEngine = compositionEngine;
    this.viewSlot = viewSlot;
    this.viewResources = viewResources;
    this.taskQueue = taskQueue;
    this.currentController = null;
    this.currentViewModel = null;
  }

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
    var _this7 = this;

    if (this.currentInstruction) {
      this.currentInstruction.model = newValue;
      return;
    }

    this.taskQueue.queueMicroTask(function () {
      if (_this7.currentInstruction) {
        _this7.currentInstruction.model = newValue;
        return;
      }

      var vm = _this7.currentViewModel;

      if (vm && typeof vm.activate === 'function') {
        vm.activate(newValue);
      }
    });
  };

  Compose.prototype.viewChanged = function viewChanged(newValue, oldValue) {
    var _this8 = this;

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
      return processInstruction(_this8, _this8.currentInstruction);
    });
  };

  Compose.prototype.viewModelChanged = function viewModelChanged(newValue, oldValue) {
    var _this9 = this;

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
      return processInstruction(_this9, _this9.currentInstruction);
    });
  };

  var _Compose = Compose;
  Compose = _aureliaDependencyInjection.inject(_aureliaPal.DOM.Element, _aureliaDependencyInjection.Container, _aureliaTemplating.CompositionEngine, _aureliaTemplating.ViewSlot, _aureliaTemplating.ViewResources, _aureliaTaskQueue.TaskQueue)(Compose) || Compose;
  Compose = _aureliaTemplating.noView(Compose) || Compose;
  Compose = _aureliaTemplating.customElement('compose')(Compose) || Compose;
  return Compose;
})();

exports.Compose = Compose;

function createInstruction(composer, instruction) {
  return Object.assign(instruction, {
    bindingContext: composer.bindingContext,
    overrideContext: composer.overrideContext,
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

var CollectionStrategy = (function () {
  function CollectionStrategy() {
    _classCallCheck(this, _CollectionStrategy);
  }

  CollectionStrategy.prototype.initialize = function initialize(repeat, bindingContext, overrideContext) {
    this.viewFactory = repeat.viewFactory;
    this.viewSlot = repeat.viewSlot;
    this.items = repeat.items;
    this.local = repeat.local;
    this.key = repeat.key;
    this.value = repeat.value;
    this.bindingContext = bindingContext;
    this.overrideContext = overrideContext;
  };

  CollectionStrategy.prototype.dispose = function dispose() {
    this.viewFactory = null;
    this.viewSlot = null;
    this.items = null;
    this.local = null;
    this.key = null;
    this.value = null;
    this.bindingContext = null;
    this.overrideContext = null;
  };

  CollectionStrategy.prototype.updateOverrideContexts = function updateOverrideContexts(startIndex) {
    var children = this.viewSlot.children;
    var length = children.length;

    if (startIndex > 0) {
      startIndex = startIndex - 1;
    }

    for (; startIndex < length; ++startIndex) {
      this.updateOverrideContext(children[startIndex].overrideContext, startIndex, length);
    }
  };

  CollectionStrategy.prototype.createFullOverrideContext = function createFullOverrideContext(data, index, length, key) {
    var overrideContext = this.createBaseOverrideContext(data, key);
    this.updateOverrideContext(overrideContext, index, length);
    return overrideContext;
  };

  CollectionStrategy.prototype.createBaseOverrideContext = function createBaseOverrideContext(data, key) {
    var bindingContext = {};
    var overrideContext = _aureliaBinding.createOverrideContext(bindingContext, this.overrideContext);

    if (typeof key !== 'undefined') {
      bindingContext[this.key] = key;
      bindingContext[this.value] = data;
    } else {
      bindingContext[this.local] = data;
    }

    return overrideContext;
  };

  CollectionStrategy.prototype.updateOverrideContext = function updateOverrideContext(overrideContext, index, length) {
    var first = index === 0;
    var last = index === length - 1;
    var even = index % 2 === 0;

    overrideContext.$index = index;
    overrideContext.$first = first;
    overrideContext.$last = last;
    overrideContext.$middle = !(first || last);
    overrideContext.$odd = !even;
    overrideContext.$even = even;
  };

  var _CollectionStrategy = CollectionStrategy;
  CollectionStrategy = _aureliaDependencyInjection.transient()(CollectionStrategy) || CollectionStrategy;
  return CollectionStrategy;
})();

exports.CollectionStrategy = CollectionStrategy;

var SignalBindingBehavior = (function () {
  SignalBindingBehavior.inject = function inject() {
    return [BindingSignaler];
  };

  function SignalBindingBehavior(bindingSignaler) {
    _classCallCheck(this, SignalBindingBehavior);

    this.signals = bindingSignaler.signals;
  }

  SignalBindingBehavior.prototype.bind = function bind(binding, source, name) {
    if (!binding.updateTarget) {
      throw new Error('Only property bindings and string interpolation bindings can be signaled.  Trigger, delegate and call bindings cannot be signaled.');
    }
    if (binding.mode === _aureliaBinding.bindingMode.oneTime) {
      throw new Error('One-time bindings cannot be signaled.');
    }
    var bindings = this.signals[name] || (this.signals[name] = []);
    bindings.push(binding);
    binding.signalName = name;
  };

  SignalBindingBehavior.prototype.unbind = function unbind(binding, source) {
    var name = binding.signalName;
    binding.signalName = null;
    var bindings = signals[name];
    bindings.splice(bindings.indexOf(binding), 1);
  };

  return SignalBindingBehavior;
})();

exports.SignalBindingBehavior = SignalBindingBehavior;

var SanitizeHTMLValueConverter = (function () {
  function SanitizeHTMLValueConverter(sanitizer) {
    _classCallCheck(this, _SanitizeHTMLValueConverter);

    this.sanitizer = sanitizer;
  }

  SanitizeHTMLValueConverter.prototype.toView = function toView(untrustedMarkup) {
    if (untrustedMarkup === null || untrustedMarkup === undefined) {
      return null;
    }

    return this.sanitizer.sanitize(untrustedMarkup);
  };

  var _SanitizeHTMLValueConverter = SanitizeHTMLValueConverter;
  SanitizeHTMLValueConverter = _aureliaDependencyInjection.inject(HTMLSanitizer)(SanitizeHTMLValueConverter) || SanitizeHTMLValueConverter;
  SanitizeHTMLValueConverter = _aureliaBinding.valueConverter('sanitizeHTML')(SanitizeHTMLValueConverter) || SanitizeHTMLValueConverter;
  return SanitizeHTMLValueConverter;
})();

exports.SanitizeHTMLValueConverter = SanitizeHTMLValueConverter;

var ArrayCollectionStrategy = (function (_CollectionStrategy2) {
  _inherits(ArrayCollectionStrategy, _CollectionStrategy2);

  function ArrayCollectionStrategy(observerLocator) {
    _classCallCheck(this, _ArrayCollectionStrategy);

    _CollectionStrategy2.call(this);
    this.observerLocator = observerLocator;
  }

  ArrayCollectionStrategy.prototype.processItems = function processItems(items) {
    var i = undefined;
    var ii = undefined;
    var overrideContext = undefined;
    var view = undefined;
    this.items = items;
    for (i = 0, ii = items.length; i < ii; ++i) {
      overrideContext = _CollectionStrategy2.prototype.createFullOverrideContext.call(this, items[i], i, ii);
      view = this.viewFactory.create();
      view.bind(overrideContext.bindingContext, overrideContext);
      this.viewSlot.add(view);
    }
  };

  ArrayCollectionStrategy.prototype.getCollectionObserver = function getCollectionObserver(items) {
    return this.observerLocator.getArrayObserver(items);
  };

  ArrayCollectionStrategy.prototype.handleChanges = function handleChanges(array, splices) {
    var _this10 = this;

    var removeDelta = 0;
    var viewSlot = this.viewSlot;
    var rmPromises = [];

    for (var i = 0, ii = splices.length; i < ii; ++i) {
      var splice = splices[i];
      var removed = splice.removed;

      for (var j = 0, jj = removed.length; j < jj; ++j) {
        var viewOrPromise = viewSlot.removeAt(splice.index + removeDelta + rmPromises.length, true);
        if (viewOrPromise instanceof Promise) {
          rmPromises.push(viewOrPromise);
        }
      }
      removeDelta -= splice.addedCount;
    }

    if (rmPromises.length > 0) {
      Promise.all(rmPromises).then(function () {
        var spliceIndexLow = _this10._handleAddedSplices(array, splices);
        _this10.updateOverrideContexts(spliceIndexLow);
      });
    } else {
      var spliceIndexLow = this._handleAddedSplices(array, splices);
      _CollectionStrategy2.prototype.updateOverrideContexts.call(this, spliceIndexLow);
    }
  };

  ArrayCollectionStrategy.prototype._handleAddedSplices = function _handleAddedSplices(array, splices) {
    var spliceIndex = undefined;
    var spliceIndexLow = undefined;
    var arrayLength = array.length;
    for (var i = 0, ii = splices.length; i < ii; ++i) {
      var splice = splices[i];
      var addIndex = spliceIndex = splice.index;
      var end = splice.index + splice.addedCount;

      if (typeof spliceIndexLow === 'undefined' || spliceIndexLow === null || spliceIndexLow > splice.index) {
        spliceIndexLow = spliceIndex;
      }

      for (; addIndex < end; ++addIndex) {
        var overrideContext = this.createFullOverrideContext(array[addIndex], addIndex, arrayLength);
        var view = this.viewFactory.create();
        view.bind(overrideContext.bindingContext, overrideContext);
        this.viewSlot.insert(addIndex, view);
      }
    }

    return spliceIndexLow;
  };

  var _ArrayCollectionStrategy = ArrayCollectionStrategy;
  ArrayCollectionStrategy = _aureliaDependencyInjection.inject(_aureliaBinding.ObserverLocator)(ArrayCollectionStrategy) || ArrayCollectionStrategy;
  return ArrayCollectionStrategy;
})(CollectionStrategy);

exports.ArrayCollectionStrategy = ArrayCollectionStrategy;

var MapCollectionStrategy = (function (_CollectionStrategy3) {
  _inherits(MapCollectionStrategy, _CollectionStrategy3);

  function MapCollectionStrategy(observerLocator) {
    _classCallCheck(this, _MapCollectionStrategy);

    _CollectionStrategy3.call(this);
    this.observerLocator = observerLocator;
  }

  MapCollectionStrategy.prototype.getCollectionObserver = function getCollectionObserver(items) {
    return this.observerLocator.getMapObserver(items);
  };

  MapCollectionStrategy.prototype.processItems = function processItems(items) {
    var _this11 = this;

    var viewFactory = this.viewFactory;
    var viewSlot = this.viewSlot;
    var index = 0;
    var overrideContext = undefined;
    var view = undefined;

    items.forEach(function (value, key) {
      overrideContext = _this11.createFullOverrideContext(value, index, items.size, key);
      view = viewFactory.create();
      view.bind(overrideContext.bindingContext, overrideContext);
      viewSlot.add(view);
      ++index;
    });
  };

  MapCollectionStrategy.prototype.handleChanges = function handleChanges(map, records) {
    var _this12 = this;

    var viewSlot = this.viewSlot;
    var key = undefined;
    var i = undefined;
    var ii = undefined;
    var view = undefined;
    var overrideContext = undefined;
    var removeIndex = undefined;
    var record = undefined;
    var rmPromises = [];
    var viewOrPromise = undefined;

    for (i = 0, ii = records.length; i < ii; ++i) {
      record = records[i];
      key = record.key;
      switch (record.type) {
        case 'update':
          removeIndex = this._getViewIndexByKey(key);
          viewOrPromise = viewSlot.removeAt(removeIndex, true);
          if (viewOrPromise instanceof Promise) {
            rmPromises.push(viewOrPromise);
          }
          overrideContext = this.createFullOverrideContext(map.get(key), removeIndex, map.size, key);
          view = this.viewFactory.create();
          view.bind(overrideContext.bindingContext, overrideContext);
          viewSlot.insert(removeIndex, view);
          break;
        case 'add':
          overrideContext = this.createFullOverrideContext(map.get(key), map.size - 1, map.size, key);
          view = this.viewFactory.create();
          view.bind(overrideContext.bindingContext, overrideContext);
          viewSlot.insert(map.size - 1, view);
          break;
        case 'delete':
          if (record.oldValue === undefined) {
            return;
          }
          removeIndex = this._getViewIndexByKey(key);
          viewOrPromise = viewSlot.removeAt(removeIndex, true);
          if (viewOrPromise instanceof Promise) {
            rmPromises.push(viewOrPromise);
          }
          break;
        case 'clear':
          viewSlot.removeAll(true);
          break;
        default:
          continue;
      }
    }

    if (rmPromises.length > 0) {
      Promise.all(rmPromises).then(function () {
        _this12.updateOverrideContexts(0);
      });
    } else {
      this.updateOverrideContexts(0);
    }
  };

  MapCollectionStrategy.prototype._getViewIndexByKey = function _getViewIndexByKey(key) {
    var viewSlot = this.viewSlot;
    var i = undefined;
    var ii = undefined;
    var child = undefined;

    for (i = 0, ii = viewSlot.children.length; i < ii; ++i) {
      child = viewSlot.children[i];
      if (child.overrideContext[this.key] === key) {
        return i;
      }
    }
  };

  var _MapCollectionStrategy = MapCollectionStrategy;
  MapCollectionStrategy = _aureliaDependencyInjection.inject(_aureliaBinding.ObserverLocator)(MapCollectionStrategy) || MapCollectionStrategy;
  return MapCollectionStrategy;
})(CollectionStrategy);

exports.MapCollectionStrategy = MapCollectionStrategy;

var NumberStrategy = (function (_CollectionStrategy4) {
  _inherits(NumberStrategy, _CollectionStrategy4);

  function NumberStrategy() {
    _classCallCheck(this, NumberStrategy);

    _CollectionStrategy4.apply(this, arguments);
  }

  NumberStrategy.prototype.getCollectionObserver = function getCollectionObserver() {
    return;
  };

  NumberStrategy.prototype.processItems = function processItems(value) {
    var viewFactory = this.viewFactory;
    var viewSlot = this.viewSlot;
    var childrenLength = viewSlot.children.length;
    var i = undefined;
    var ii = undefined;
    var overrideContext = undefined;
    var view = undefined;
    var viewsToRemove = undefined;

    value = Math.floor(value);
    viewsToRemove = childrenLength - value;

    if (viewsToRemove > 0) {
      if (viewsToRemove > childrenLength) {
        viewsToRemove = childrenLength;
      }

      for (i = 0, ii = viewsToRemove; i < ii; ++i) {
        viewSlot.removeAt(childrenLength - (i + 1), true);
      }

      return;
    }

    for (i = childrenLength, ii = value; i < ii; ++i) {
      overrideContext = this.createFullOverrideContext(i, i, ii);
      view = viewFactory.create();
      view.bind(overrideContext.bindingContext, overrideContext);
      viewSlot.add(view);
    }

    this.updateOverrideContexts(0);
  };

  return NumberStrategy;
})(CollectionStrategy);

exports.NumberStrategy = NumberStrategy;

var CollectionStrategyLocator = (function () {
  function CollectionStrategyLocator(container) {
    _classCallCheck(this, _CollectionStrategyLocator);

    this.container = container;
    this.strategies = [];
    this.matchers = [];

    this.addStrategy(ArrayCollectionStrategy, function (items) {
      return items instanceof Array;
    });
    this.addStrategy(MapCollectionStrategy, function (items) {
      return items instanceof Map;
    });
    this.addStrategy(NumberStrategy, function (items) {
      return typeof items === 'number';
    });
  }

  CollectionStrategyLocator.prototype.addStrategy = function addStrategy(collectionStrategy, matcher) {
    this.strategies.push(collectionStrategy);
    this.matchers.push(matcher);
  };

  CollectionStrategyLocator.prototype.getStrategy = function getStrategy(items) {
    var matchers = this.matchers;

    for (var i = 0, ii = matchers.length; i < ii; ++i) {
      if (matchers[i](items)) {
        return this.container.get(this.strategies[i]);
      }
    }

    throw new Error('Object in "repeat" must have a valid collection strategy.');
  };

  var _CollectionStrategyLocator = CollectionStrategyLocator;
  CollectionStrategyLocator = _aureliaDependencyInjection.inject(_aureliaDependencyInjection.Container)(CollectionStrategyLocator) || CollectionStrategyLocator;
  return CollectionStrategyLocator;
})();

exports.CollectionStrategyLocator = CollectionStrategyLocator;

var Repeat = (function () {
  var _instanceInitializers2 = {};

  _createDecoratedClass(Repeat, [{
    key: 'items',
    decorators: [_aureliaTemplating.bindable],
    initializer: null,
    enumerable: true
  }, {
    key: 'local',
    decorators: [_aureliaTemplating.bindable],
    initializer: null,
    enumerable: true
  }, {
    key: 'key',
    decorators: [_aureliaTemplating.bindable],
    initializer: null,
    enumerable: true
  }, {
    key: 'value',
    decorators: [_aureliaTemplating.bindable],
    initializer: null,
    enumerable: true
  }], null, _instanceInitializers2);

  function Repeat(viewFactory, instruction, viewSlot, viewResources, observerLocator, collectionStrategyLocator) {
    _classCallCheck(this, _Repeat);

    _defineDecoratedPropertyDescriptor(this, 'items', _instanceInitializers2);

    _defineDecoratedPropertyDescriptor(this, 'local', _instanceInitializers2);

    _defineDecoratedPropertyDescriptor(this, 'key', _instanceInitializers2);

    _defineDecoratedPropertyDescriptor(this, 'value', _instanceInitializers2);

    this.viewFactory = viewFactory;
    this.instruction = instruction;
    this.viewSlot = viewSlot;
    this.lookupFunctions = viewResources.lookupFunctions;
    this.observerLocator = observerLocator;
    this.local = 'item';
    this.key = 'key';
    this.value = 'value';
    this.collectionStrategyLocator = collectionStrategyLocator;
    this.ignoreMutation = false;
  }

  Repeat.prototype.call = function call(context, changes) {
    this[context](this.items, changes);
  };

  Repeat.prototype.bind = function bind(bindingContext, overrideContext) {
    var items = this.items;
    this.sourceExpression = getSourceExpression(this.instruction, 'repeat.for');
    this.scope = { bindingContext: bindingContext, overrideContext: overrideContext };
    if (items === undefined || items === null) {
      return;
    }
    this._processItems();
  };

  Repeat.prototype.unbind = function unbind() {
    this.sourceExpression = null;
    this.scope = null;
    if (this.collectionStrategy) {
      this.collectionStrategy.dispose();
    }
    this.items = null;
    this.collectionStrategy = null;
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
    this._processItems();
  };

  Repeat.prototype._processItems = function _processItems() {
    var _this13 = this;

    var items = this.items;

    this._unsubscribeCollection();
    var rmPromise = this.viewSlot.removeAll(true);
    if (this.collectionStrategy) {
      this.collectionStrategy.dispose();
    }

    if (!items && items !== 0) {
      return;
    }

    var bindingContext = undefined;
    var overrideContext = undefined;
    if (this.scope) {
      bindingContext = this.scope.bindingContext;
      overrideContext = this.scope.overrideContext;
    }

    this.collectionStrategy = this.collectionStrategyLocator.getStrategy(items);
    this.collectionStrategy.initialize(this, bindingContext, overrideContext);

    if (rmPromise instanceof Promise) {
      rmPromise.then(function () {
        _this13.processItemsByStrategy();
      });
    } else {
      this.processItemsByStrategy();
    }
  };

  Repeat.prototype._getInnerCollection = function _getInnerCollection() {
    var expression = unwrapExpression(this.sourceExpression);
    if (!expression) {
      return null;
    }
    return expression.evaluate(this.scope, null);
  };

  Repeat.prototype._observeInnerCollection = function _observeInnerCollection() {
    var items = this._getInnerCollection();
    if (items instanceof Array) {
      this.collectionObserver = this.observerLocator.getArrayObserver(items);
    } else if (items instanceof Map) {
      this.collectionObserver = this.observerLocator.getMapObserver(items);
    } else {
      return false;
    }
    this.callContext = 'handleInnerCollectionChanges';
    this.collectionObserver.subscribe(this.callContext, this);
    return true;
  };

  Repeat.prototype._observeCollection = function _observeCollection() {
    var items = this.items;
    this.collectionObserver = this.collectionStrategy.getCollectionObserver(items);
    if (this.collectionObserver) {
      this.callContext = 'handleCollectionChanges';
      this.collectionObserver.subscribe(this.callContext, this);
    }
  };

  Repeat.prototype.processItemsByStrategy = function processItemsByStrategy() {
    if (!this._observeInnerCollection()) {
      this._observeCollection();
    }
    this.collectionStrategy.processItems(this.items);
  };

  Repeat.prototype.handleCollectionChanges = function handleCollectionChanges(collection, changes) {
    this.collectionStrategy.handleChanges(collection, changes);
  };

  Repeat.prototype.handleInnerCollectionChanges = function handleInnerCollectionChanges(collection, changes) {
    var _this14 = this;

    if (this.ignoreMutation) {
      return;
    }
    this.ignoreMutation = true;
    var newItems = this.sourceExpression.evaluate(this.scope, this.lookupFunctions);
    this.observerLocator.taskQueue.queueMicroTask(function () {
      return _this14.ignoreMutation = false;
    });

    if (newItems === this.items) {
      return;
    }
    this.items = newItems;
    this.itemsChanged();
  };

  var _Repeat = Repeat;
  Repeat = _aureliaDependencyInjection.inject(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.TargetInstruction, _aureliaTemplating.ViewSlot, _aureliaTemplating.ViewResources, _aureliaBinding.ObserverLocator, CollectionStrategyLocator)(Repeat) || Repeat;
  Repeat = _aureliaTemplating.templateController(Repeat) || Repeat;
  Repeat = _aureliaTemplating.customAttribute('repeat')(Repeat) || Repeat;
  return Repeat;
})();

exports.Repeat = Repeat;

function getSourceExpression(instruction, attrName) {
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

function configure(config) {
  if (_aureliaPal.FEATURE.shadowDOM) {
    _aureliaPal.DOM.injectStyles('body /deep/ .aurelia-hide { display:none !important; }');
  } else {
    _aureliaPal.DOM.injectStyles('.aurelia-hide { display:none !important; }');
  }

  config.globalResources('./compose', './if', './with', './repeat', './show', './replaceable', './sanitize-html', './focus', './compile-spy', './view-spy', './binding-mode-behaviors', './throttle-binding-behavior', './debounce-binding-behavior', './signal-binding-behavior', './update-trigger-binding-behavior');

  var viewEngine = config.container.get(_aureliaTemplating.ViewEngine);
  var loader = config.aurelia.loader;

  viewEngine.addResourcePlugin('.html', {
    'fetch': function fetch(address) {
      return loader.loadTemplate(address).then(function (registryEntry) {
        var _ref;

        var bindable = registryEntry.template.getAttribute('bindable');
        var elementName = address.replace('.html', '');
        var index = elementName.lastIndexOf('/');

        if (index !== 0) {
          elementName = elementName.substring(index + 1);
        }

        if (bindable) {
          bindable = bindable.split(',').map(function (x) {
            return x.trim();
          });
          registryEntry.template.removeAttribute('bindable');
        } else {
          bindable = [];
        }

        return (_ref = {}, _ref[elementName] = _createDynamicElement(elementName, address, bindable), _ref);
      });
    }
  });

  viewEngine.addResourcePlugin('.css', {
    'fetch': function fetch(address) {
      var _ref2;

      return (_ref2 = {}, _ref2[address] = _createCSSResource(address), _ref2);
    }
  });
}

exports.Compose = Compose;
exports.If = If;
exports.With = With;
exports.Repeat = Repeat;
exports.Show = Show;
exports.HTMLSanitizer = HTMLSanitizer;
exports.SanitizeHTMLValueConverter = SanitizeHTMLValueConverter;
exports.Replaceable = Replaceable;
exports.Focus = Focus;
exports.CompileSpy = CompileSpy;
exports.ViewSpy = ViewSpy;
exports.configure = configure;
exports.OneTimeBindingBehavior = OneTimeBindingBehavior;
exports.OneWayBindingBehavior = OneWayBindingBehavior;
exports.TwoWayBindingBehavior = TwoWayBindingBehavior;
exports.ThrottleBindingBehavior = ThrottleBindingBehavior;
exports.DebounceBindingBehavior = DebounceBindingBehavior;
exports.SignalBindingBehavior = SignalBindingBehavior;
exports.BindingSignaler = BindingSignaler;
exports.UpdateTriggerBindingBehavior = UpdateTriggerBindingBehavior;