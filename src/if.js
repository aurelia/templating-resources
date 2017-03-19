import {BoundViewFactory, ViewSlot, bindable, customAttribute, templateController} from 'aurelia-templating';
import {inject} from 'aurelia-dependency-injection';
import {DOM} from 'aurelia-pal';

class IfCore {
  constructor(viewFactory, viewSlot) {
    this.viewFactory = viewFactory;
    this.viewSlot = viewSlot;
    this.view = null;
    this.bindingContext = null;
    this.overrideContext = null;
    // If the child view is animated, `value` might not reflect the internal 
    // state anymore, so we use `showing` for that. 
    // Eventually, `showing` and `value` should be consistent.
    this.showing = false;
  }

  bind(bindingContext, overrideContext) {
    // Store parent bindingContext, so we can pass it down
    this.bindingContext = bindingContext;
    this.overrideContext = overrideContext;
  }

  unbind() {
    if (this.view === null) {
      return;
    }

    this.view.unbind();

    // It seems to me that this code is subject to race conditions when animating.
    // For example a view could be returned to the cache and reused while it's still
    // attached to the DOM and animated.
    if (!this.viewFactory.isCaching) {
      return;
    }
    
    if (this.showing) {
      this.showing = false;
      this.viewSlot.remove(this.view, /*returnToCache:*/true, /*skipAnimation:*/true);
    }
    else {
      this.view.returnToCache();
    }
    this.view = null;
  }

  _show() {
    if (this.showing) {
      return;
    }

    if (this.view === null) {
      this.view = this.viewFactory.create();
    }

    if (!this.view.isBound) {
      this.view.bind(this.bindingContext, this.overrideContext);
    }

    this.showing = true;
    return this.viewSlot.add(this.view); // Promise or void
  }

  _hide() {
    if (!this.showing) {
      return;
    }

    this.showing = false;
    let removed = this.viewSlot.remove(this.view); // Promise or View
    if (removed instanceof Promise) {
      return removed.then(() => this.view.unbind());
    } 
    else {
      this.view.unbind();
    }                
  }
}

/**
* Binding to conditionally include or not include template logic depending on returned result
* - value should be Boolean or will be treated as such (truthy / falsey)
*/
@customAttribute('if')
@templateController
@inject(BoundViewFactory, ViewSlot)
export class If extends IfCore {
  @bindable({ primaryProperty: true }) condition: any;
  @bindable swap: "before"|"with"|"after";

  /**
  * Binds the if to the binding context and override context
  * @param bindingContext The binding context
  * @param overrideContext An override context for binding.
  */
  bind(bindingContext, overrideContext) {
    super.bind(bindingContext, overrideContext);
    this.conditionChanged(this.condition);
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
    if (this.else) {
      promise = show ? this._swap(this.else, this) : this._swap(this, this.else);
    }
    else {
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
    switch (this.swap) {
      case "before":
        return Promise.resolve(add._show()).then(() => remove._hide());
      case "with":
        return Promise.all([ remove._hide(), add._show() ]);
      default:  // "after", default and unknown values
        let promise = remove._hide();
        return promise ? promise.then(() => add._show()) : add._show();
    }
  }
}

@customAttribute('else')
@templateController
@inject(BoundViewFactory, ViewSlot)
export class Else extends IfCore {  
  constructor(viewFactory, viewSlot) {
    super(viewFactory, viewSlot);
    this._registerInIf();
  }

  _registerInIf() {
    // We support the pattern <div if.bind="x"></div><div else></div>.
    // Obvisouly between the two, we must accepts text (spaces) and comments.
    // The `if` node is expected to be a comment anchor, because of `@templateController`.
    // To simplify the code we basically walk up to the first Aurelia predecessor,
    // so having static tags in between (no binding) would work but is not intended to be supported.
    let previous = this.viewSlot.anchor.previousSibling;
    while (previous && !previous.au) {
      previous = previous.previousSibling;
    }
    if (!previous || !previous.au.if) {
      throw new Error("Can't find matching If for Else custom attribute.");
    }
    let ifVm = previous.au.if.viewModel;
    ifVm.else = this;
  }
}
