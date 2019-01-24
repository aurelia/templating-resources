import {BoundViewFactory, ViewSlot, bindable, customAttribute, templateController} from 'aurelia-templating';
import {inject} from 'aurelia-dependency-injection';
import {IfCore} from './if-core';

/**
* Binding to conditionally include or not include template logic depending on returned result
* - value should be Boolean or will be treated as such (truthy / falsey)
*/
@customAttribute('if')
@templateController
@inject(BoundViewFactory, ViewSlot)
export class If extends IfCore {
  @bindable({ primaryProperty: true }) condition: any;
  @bindable swapOrder: "before"|"with"|"after";
  @bindable cache: boolean|string = true;

  /**
  * Binds the if to the binding context and override context
  * @param bindingContext The binding context
  * @param overrideContext An override context for binding.
  */
  bind(bindingContext, overrideContext) {
    super.bind(bindingContext, overrideContext);
    if (this.condition) {
      this._show();
    } else {
      this._hide();
    }
  }

  /**
  * Invoked everytime value property changes.
  * @param newValue The new value
  */
  conditionChanged(newValue) {
    this._update(newValue);
  }

  _update(show) {
    if (this.animating) {
      return;
    }

    let promise;
    if (this.elseVm) {
      promise = show ? this._swap(this.elseVm, this) : this._swap(this, this.elseVm);
    } else {
      promise = show ? this._show() : this._hide();
    }

    if (promise) {
      this.animating = true;
      promise.then(() => {
        this.animating = false;
        if (this.condition !== this.showing) {
          this._update(this.condition);
        }
      });
    }
  }

  _swap(remove, add) {
    switch (this.swapOrder) {
    case 'before':
      return Promise.resolve(add._show()).then(() => remove._hide());
    case 'with':
      return Promise.all([ remove._hide(), add._show() ]);
    default:  // "after", default and unknown values
      let promise = remove._hide();
      return promise ? promise.then(() => add._show()) : add._show();
    }
  }
}
