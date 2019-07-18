import './setup';
import {Hide} from '../src/hide';
import {AureliaHideStyle} from '../src/aurelia-hide-style';
import {AnimatorMock} from './hide.spec';

describe('hide', () => {
  let sut, animator;

  beforeEach(() => {
    animator = new AnimatorMock();
  });

  it('should add overridden class with animator.addClass when value is true', () => {

    AureliaHideStyle.instance().override('overridden');

    let target = document.createElement('input');

    sut = new Hide(target, animator, null);

    spyOn(animator, 'addClass');

    sut.valueChanged(true);

    expect(animator.addClass).toHaveBeenCalledWith(target, 'overridden');
  });
}
