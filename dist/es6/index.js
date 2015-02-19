import {Compose} from './compose';
import {If} from './if';
import {With} from './with';
import {Repeat} from './repeat';
import {Show} from './show';
import {SelectedItem} from './selected-item';
import {GlobalBehavior} from './global-behavior';
import {InnerHTML} from './inner-html';

function install(aurelia){
  aurelia.withResources([Show, If, With, Repeat, Compose, SelectedItem, GlobalBehavior, InnerHTML]);
}

export {
  Compose,
  If,
  With,
  Repeat,
  Show,
  InnerHTML,
  SelectedItem,
  GlobalBehavior,
  install
};
