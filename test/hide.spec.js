import './setup';
import {Hide} from '../src/hide';
import {aureliaHideClassName} from '../src/aurelia-hide-style';
import {FEATURE} from 'aurelia-pal';

describe('hide', () => {
  let sut, animator;

  beforeEach(() => {
    animator = new AnimatorMock();
  });

  it('should add aurelia-hide with animator.addClass when value is true', () => {
    let target = document.createElement('input');

    sut = new Hide(target, animator, null);

    spyOn(animator, 'addClass');

    sut.valueChanged(true);

    expect(animator.addClass).toHaveBeenCalledWith(target, aureliaHideClassName);
  });

  it('should remove aurelia-hide with animator.addClass when value is false', () => {
    let target = document.createElement('input');

    sut = new Hide(target, animator, null);

    spyOn(animator, 'removeClass');

    sut.valueChanged(false);

    expect(animator.removeClass).toHaveBeenCalledWith(target, aureliaHideClassName);
  });

  it('should inject aurelia-hide style in DOM boundary when created', () => {
    let shadowDOM = FEATURE.shadowDOM;
    FEATURE.shadowDOM = true;
    let target = document.createElement('input');
    let boundary = document.createElement('div');
    sut = new Hide(target, animator, boundary);
    sut.created();
    expect(boundary.hasAureliaHideStyle).toBe(true);
    FEATURE.shadowDOM = shadowDOM;
  });
});

class AnimatorMock {
  addClass() {}
  removeClass() {}
}
