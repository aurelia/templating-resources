import './setup';
import {Show} from '../src/show';
import {aureliaHideClassName} from '../src/aurelia-hide-style';
import {FEATURE} from 'aurelia-pal';

describe('show', () => {
  let sut, animator;

  beforeEach(() => {
    animator = new AnimatorMock();
  });

  it('should add aurelia-hide with animator.addClass when value is false', () => {
    let target = document.createElement('input');

    sut = new Show(target, animator, null);

    spyOn(animator, 'addClass');

    sut.valueChanged(false);

    expect(animator.addClass).toHaveBeenCalledWith(target, aureliaHideClassName);
  });

  it('should remove aurelia-hide with animator.addClass when value is true', () => {
    let target = document.createElement('input');

    sut = new Show(target, animator, null);

    spyOn(animator, 'removeClass');

    sut.valueChanged(true);

    expect(animator.removeClass).toHaveBeenCalledWith(target, aureliaHideClassName);
  });

  it('should inject aurelia-hide style in DOM boundary when created', () => {
    let shadowDOM = FEATURE.shadowDOM;
    FEATURE.shadowDOM = true;
    let target = document.createElement('input');
    let boundary = document.createElement('div');
    sut = new Show(target, animator, boundary);
    sut.created();
    expect(boundary.hasAureliaHideStyle).toBe(true);
    FEATURE.shadowDOM = shadowDOM;
  });
});

class AnimatorMock {
  addClass() {}
  removeClass() {}
}
