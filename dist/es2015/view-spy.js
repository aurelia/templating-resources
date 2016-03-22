var _dec, _class;

import { customAttribute } from 'aurelia-templating';
import * as LogManager from 'aurelia-logging';

export let ViewSpy = (_dec = customAttribute('view-spy'), _dec(_class = class ViewSpy {
  constructor() {
    this.logger = LogManager.getLogger('view-spy');
  }

  _log(lifecycleName, context) {
    if (!this.value && lifecycleName === 'created') {
      this.logger.info(lifecycleName, this.view);
    } else if (this.value && this.value.indexOf(lifecycleName) !== -1) {
      this.logger.info(lifecycleName, this.view, context);
    }
  }

  created(view) {
    this.view = view;
    this._log('created');
  }

  bind(bindingContext) {
    this._log('bind', bindingContext);
  }

  attached() {
    this._log('attached');
  }

  detached() {
    this._log('detached');
  }

  unbind() {
    this._log('unbind');
  }
}) || _class);