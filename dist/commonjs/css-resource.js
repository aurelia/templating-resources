'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._createCSSResource = _createCSSResource;

var _aureliaTemplating = require('aurelia-templating');

var _aureliaLoader = require('aurelia-loader');

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaPath = require('aurelia-path');

var _aureliaPal = require('aurelia-pal');

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
    var _this = this;

    return container.get(_aureliaLoader.Loader).loadText(this.address).catch(function (err) {
      return null;
    }).then(function (text) {
      text = fixupCSSUrls(_this.address, text);
      _this._global.css = text;
      _this._scoped.css = text;
    });
  };

  return CSSResource;
}();

var CSSViewEngineHooks = function () {
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
}();

function _createCSSResource(address) {
  var _dec, _class;

  var ViewCSS = (_dec = (0, _aureliaTemplating.resource)(new CSSResource(address)), _dec(_class = function (_CSSViewEngineHooks) {
    _inherits(ViewCSS, _CSSViewEngineHooks);

    function ViewCSS() {
      _classCallCheck(this, ViewCSS);

      return _possibleConstructorReturn(this, _CSSViewEngineHooks.apply(this, arguments));
    }

    return ViewCSS;
  }(CSSViewEngineHooks)) || _class);

  return ViewCSS;
}