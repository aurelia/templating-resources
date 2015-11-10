System.register(['aurelia-binding'], function (_export) {
  'use strict';

  var bindingMode, ModeBindingBehavior, OneTimeBindingBehavior, OneWayBindingBehavior, TwoWayBindingBehavior;

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaBinding) {
      bindingMode = _aureliaBinding.bindingMode;
    }],
    execute: function () {
      ModeBindingBehavior = (function () {
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

      OneTimeBindingBehavior = (function (_ModeBindingBehavior) {
        _inherits(OneTimeBindingBehavior, _ModeBindingBehavior);

        function OneTimeBindingBehavior() {
          _classCallCheck(this, OneTimeBindingBehavior);

          _ModeBindingBehavior.call(this, bindingMode.oneTime);
        }

        return OneTimeBindingBehavior;
      })(ModeBindingBehavior);

      _export('OneTimeBindingBehavior', OneTimeBindingBehavior);

      OneWayBindingBehavior = (function (_ModeBindingBehavior2) {
        _inherits(OneWayBindingBehavior, _ModeBindingBehavior2);

        function OneWayBindingBehavior() {
          _classCallCheck(this, OneWayBindingBehavior);

          _ModeBindingBehavior2.call(this, bindingMode.oneWay);
        }

        return OneWayBindingBehavior;
      })(ModeBindingBehavior);

      _export('OneWayBindingBehavior', OneWayBindingBehavior);

      TwoWayBindingBehavior = (function (_ModeBindingBehavior3) {
        _inherits(TwoWayBindingBehavior, _ModeBindingBehavior3);

        function TwoWayBindingBehavior() {
          _classCallCheck(this, TwoWayBindingBehavior);

          _ModeBindingBehavior3.call(this, bindingMode.twoWay);
        }

        return TwoWayBindingBehavior;
      })(ModeBindingBehavior);

      _export('TwoWayBindingBehavior', TwoWayBindingBehavior);
    }
  };
});