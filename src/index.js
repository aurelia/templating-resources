import {Compose} from './compose';
import {If} from './if';
import {Repeat} from './repeat';
import {Show} from './show';
import {SelectedItem} from './selected-item';
import {GlobalBehavior} from './global-behavior';
import {InnerHTML} from './inner-html';

function install(aurelia){
  aurelia.withResources([Show, If, Repeat, Compose, SelectedItem, GlobalBehavior, InnerHTML]);
}

export {
  Compose,
  If,
  Repeat,
  Show,
  InnerHTML,
  SelectedItem,
  GlobalBehavior,
  install
};
