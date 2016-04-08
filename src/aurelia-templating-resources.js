import {Compose} from './compose';
import {If} from './if';
import {With} from './with';
import {Repeat} from './repeat';
import {Show} from './show';
import {Hide} from './hide';
import {SanitizeHTMLValueConverter} from './sanitize-html';
import {Replaceable} from './replaceable';
import {Focus} from './focus';
import {CompileSpy} from './compile-spy';
import {ViewSpy} from './view-spy';
import {ViewEngine} from 'aurelia-templating';
import {_createCSSResource} from './css-resource';
import {FEATURE, DOM} from 'aurelia-pal';
import {HTMLSanitizer} from './html-sanitizer';
import {OneTimeBindingBehavior, OneWayBindingBehavior, TwoWayBindingBehavior} from './binding-mode-behaviors';
import {ThrottleBindingBehavior} from './throttle-binding-behavior';
import {DebounceBindingBehavior} from './debounce-binding-behavior';
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

function configure(config) {
  if (FEATURE.shadowDOM) {
    DOM.injectStyles('body /deep/ .aurelia-hide { display:none !important; }');
  } else {
    DOM.injectStyles('.aurelia-hide { display:none !important; }');
  }

  config.globalResources(
    './compose',
    './if',
    './with',
    './repeat',
    './show',
    './hide',
    './replaceable',
    './sanitize-html',
    './focus',
    './compile-spy',
    './view-spy',
    './binding-mode-behaviors',
    './throttle-binding-behavior',
    './debounce-binding-behavior',
    './signal-binding-behavior',
    './update-trigger-binding-behavior'
  );

  configureHtmlResourcePlugin(config);

  let viewEngine = config.container.get(ViewEngine);
  viewEngine.addResourcePlugin('.css', {
    'fetch': function(address) {
      return { [address]: _createCSSResource(address) };
    }
  });
}

export {
  Compose,
  If,
  With,
  Repeat,
  Show,
  Hide,
  HTMLSanitizer,
  SanitizeHTMLValueConverter,
  Replaceable,
  Focus,
  CompileSpy,
  ViewSpy,
  configure,
  OneTimeBindingBehavior,
  OneWayBindingBehavior,
  TwoWayBindingBehavior,
  ThrottleBindingBehavior,
  DebounceBindingBehavior,
  SignalBindingBehavior,
  BindingSignaler,
  UpdateTriggerBindingBehavior,
  AbstractRepeater,
  RepeatStrategyLocator,
  NullRepeatStrategy,
  ArrayRepeatStrategy,
  MapRepeatStrategy,
  SetRepeatStrategy,
  NumberRepeatStrategy
};
