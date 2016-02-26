import './setup';
import {Hide} from '../src/hide';

describe('hide', () => {
  let sut, animator;

  beforeEach(() => {
    animator = new AnimatorMock();
  });

  it('should add aurelia-hide with animator.addClass when value is true', () => {
    let target = document.createElement('input');

    sut = new Hide(target, animator);

    spyOn(animator, 'addClass');

    sut.valueChanged(true);

    expect(animator.addClass).toHaveBeenCalledWith(target, 'aurelia-hide');
  });

  it('should remove aurelia-hide with animator.addClass when value is false', () => {
    let target = document.createElement('input');

    sut = new Hide(target, animator);

    spyOn(animator, 'removeClass');

    sut.valueChanged(false);

    expect(animator.removeClass).toHaveBeenCalledWith(target, 'aurelia-hide');
  });
});

class AnimatorMock {
  addClass() {}
  removeClass() {}
}
