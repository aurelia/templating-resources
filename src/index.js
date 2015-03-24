import {Compose} from './compose';
import {If} from './if';
import {With} from './with';
import {Repeat} from './repeat';
import {Show} from './show';
import {GlobalBehavior} from './global-behavior';
import {SanitizeHtmlValueConverter} from './sanitize-html';

function install(aurelia){
  aurelia.globalizeResources(
    './compose',
    './if',
    './with',
    './repeat',
    './show',
    './global-behavior',
    './sanitize-html'
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
  install
};
