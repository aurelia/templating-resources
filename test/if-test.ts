import {BoundViewFactory, ViewSlot, bindable, customAttribute, templateController} from 'aurelia-templating';
import {If} from '../src/if';
import {inject} from 'aurelia-dependency-injection';

@customAttribute('ift')
@templateController
@inject(BoundViewFactory, ViewSlot)
export class IfTest extends If {
  @bindable({primaryProperty: true}) condition;
  @bindable swapOrder;
}
