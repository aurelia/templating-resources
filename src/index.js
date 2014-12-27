import {Compose} from './compose';
import {If} from './if';
import {Repeat} from './repeat';
import {Show} from './show';
import {SelectedItem} from './selected-item';

function install(aurelia){
  aurelia.withResources([Show, If, Repeat, Compose, SelectedItem]);
}

export {
  Compose,
  If,
  Repeat,
  Show,
  SelectedItem,
  install
};