import {Compose} from './compose';
import {If} from './if';
import {With} from './with';
import {Repeat} from './repeat';
import {Show} from './show';
import {GlobalBehavior} from './global-behavior';
import {SanitizeHtmlValueConverter} from './sanitize-html';
import {Replaceable} from './replaceable';
import {Focus} from './focus';

function configure(config){
  config.globalResources(
    './compose',
    './if',
    './with',
    './repeat',
    './show',
    './replaceable',
    './global-behavior',
    './sanitize-html',
    './focus'
  );
}

export {
  Compose,
  If,
  With,
  Repeat,
  Show,
  SanitizeHtmlValueConverter,
  GlobalBehavior,
  Replaceable,
  Focus,
  configure
};
