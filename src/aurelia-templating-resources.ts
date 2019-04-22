import {Compose} from './compose';
import {If} from './if';
import {Else} from './else';
import {With} from './with';
import {Repeat} from './repeat';
import {Show} from './show';
import {Hide} from './hide';
import {SanitizeHTMLValueConverter} from './sanitize-html';
import {Replaceable} from './replaceable';
import {Focus} from './focus';
import {ViewEngine} from 'aurelia-templating';
import {_createCSSResource} from './css-resource';
import {HTMLSanitizer} from './html-sanitizer';
import {AttrBindingBehavior} from './attr-binding-behavior';
import {OneTimeBindingBehavior, OneWayBindingBehavior, TwoWayBindingBehavior, FromViewBindingBehavior, ToViewBindingBehavior} from './binding-mode-behaviors';
import {ThrottleBindingBehavior} from './throttle-binding-behavior';
import {DebounceBindingBehavior} from './debounce-binding-behavior';
import {SelfBindingBehavior} from './self-binding-behavior';
import {SignalBindingBehavior} from './signal-binding-behavior';
import {BindingSignaler} from './binding-signaler';
import {UpdateTriggerBindingBehavior} from './update-trigger-binding-behavior';
import {AbstractRepeater} from './abstract-repeater';
import {RepeatStrategyLocator} from './repeat-strategy-locator';
import {configure as configureHtmlResourcePlugin} from './html-resource-plugin';
import {NullRepeatStrategy} from './null-repeat-strategy';
import {ArrayRepeatStrategy} from './array-repeat-strategy';
import {MapRepeatStrategy} from './map-repeat-strategy';
import {SetRepeatStrategy} from './set-repeat-strategy';
import {NumberRepeatStrategy} from './number-repeat-strategy';
import {
  createFullOverrideContext,
  updateOverrideContext,
  getItemsSourceExpression,
  isOneTime,
  updateOneTimeBinding,
  unwrapExpression
} from './repeat-utilities';
import {viewsRequireLifecycle} from './analyze-view-factory';
import {injectAureliaHideStyleAtHead} from './aurelia-hide-style';

function configure(config) {
  injectAureliaHideStyleAtHead();

  config.globalResources(
    Compose,
    If,
    Else,
    With,
    Repeat,
    Show,
    Hide,
    Replaceable,
    Focus,
    SanitizeHTMLValueConverter,
    OneTimeBindingBehavior,
    OneWayBindingBehavior,
    ToViewBindingBehavior,
    FromViewBindingBehavior,
    TwoWayBindingBehavior,
    ThrottleBindingBehavior,
    DebounceBindingBehavior,
    SelfBindingBehavior,
    SignalBindingBehavior,
    UpdateTriggerBindingBehavior,
    AttrBindingBehavior
  );

  configureHtmlResourcePlugin(config);

  let viewEngine = config.container.get(ViewEngine);
  let styleResourcePlugin = {
    fetch(address) {
      return { [address]: _createCSSResource(address) };
    }
  };
  ['.css', '.less', '.sass', '.scss', '.styl'].forEach(ext => viewEngine.addResourcePlugin(ext, styleResourcePlugin));
}

export {
  Compose,
  If,
  Else,
  With,
  Repeat,
  Show,
  Hide,
  HTMLSanitizer,
  SanitizeHTMLValueConverter,
  Replaceable,
  Focus,
  configure,
  AttrBindingBehavior,
  OneTimeBindingBehavior,
  OneWayBindingBehavior,
  ToViewBindingBehavior,
  FromViewBindingBehavior,
  TwoWayBindingBehavior,
  ThrottleBindingBehavior,
  DebounceBindingBehavior,
  SelfBindingBehavior,
  SignalBindingBehavior,
  BindingSignaler,
  UpdateTriggerBindingBehavior,
  AbstractRepeater,
  RepeatStrategyLocator,
  NullRepeatStrategy,
  ArrayRepeatStrategy,
  MapRepeatStrategy,
  SetRepeatStrategy,
  NumberRepeatStrategy,
  createFullOverrideContext,
  updateOverrideContext,
  getItemsSourceExpression,
  isOneTime,
  updateOneTimeBinding,
  unwrapExpression,
  viewsRequireLifecycle
};
