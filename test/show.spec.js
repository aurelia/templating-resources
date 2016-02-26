import './setup';
import {Show} from '../src/show';

describe('show', () => {
  let sut, animator;

  beforeEach(() => {
    animator = new AnimatorMock();
  });

  it('should add aurelia-hide with animator.addClass when value is false', () => {
    let target = document.createElement('input');

    sut = new Show(target, animator);

    spyOn(animator, 'addClass');

    sut.valueChanged(false);

    expect(animator.addClass).toHaveBeenCalledWith(target, 'aurelia-hide');
  });

  it('should remove aurelia-hide with animator.addClass when value is true', () => {
    let target = document.createElement('input');

    sut = new Show(target, animator);

    spyOn(animator, 'removeClass');

    sut.valueChanged(true);

    expect(animator.removeClass).toHaveBeenCalledWith(target, 'aurelia-hide');
  });
});

class AnimatorMock {
  addClass() {}
  removeClass() {}
}
