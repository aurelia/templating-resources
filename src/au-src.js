import {inject, noView, customAttribute} from 'aurelia-framework';

/**
 * Binding to src on an image is troubling, because browsers fetch images immediatelly. To get around this, we introduce
 * custom attribute which syncs only non empty string values, otherwise it sets the attribute to null
 *
 * @class AuSrc
 * @constructor
 */
@noView
@customAttribute('au-src')
@inject(Element)
export class AuSrc {
    constructor(element) {
        this.element = element;
        var src = element.getAttribute('src');
        this.valueChanged(src);
    }

    valueChanged(newValue){
        if (newValue && typeof newValue === 'string') {
            this.element.setAttribute('src', newValue);
        } else {
            this.element.setAttribute('src', null);
        }
    }
}
