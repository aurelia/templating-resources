
import {Repeat} from '../src/repeat';
import {ObserverLocator} from 'aurelia-binding';
import {BoundViewFactory} from 'aurelia-templating';

class ViewSlotMock {
  removeAll(){}
  add(){}
}

class ViewMock {
  unbind(){}
}

xdescribe('repeat', () => {
  let repeat, viewSlot, viewFactory, view1, view2;

  beforeEach(() => {
    viewSlot = new ViewSlotMock();
    viewFactory = new BoundViewFactory();
    repeat = new Repeat(viewFactory, viewSlot, new ObserverLocator());
    viewSlot.children = [];
    spyOn(viewFactory, 'create').and.callFake(() => {});
  });

  describe('bind', () => {
    it('should remove and unbind all old views if it has old items and provided with new items', () => {
      view1 = new ViewMock();
      view2 = new ViewMock();
      viewSlot.children = [view1, view2];

      repeat.items = ['1', '2'];
      repeat.oldItems = ['a', 'b'];

      spyOn(viewSlot, 'removeAll');
      spyOn(view1, 'unbind');
      spyOn(view2, 'unbind');

      repeat.bind();

      expect(viewSlot.removeAll).toHaveBeenCalled();
      expect(view1.unbind).toHaveBeenCalled();
      expect(view2.unbind).toHaveBeenCalled();
    });

    it('should remove and unbind all old views if it has old items and no new items', () => {
      view1 = new ViewMock();
      view2 = new ViewMock();
      viewSlot.children = [view1, view2];

      repeat.items = undefined;
      repeat.oldItems = ['a', 'b'];

      spyOn(viewSlot, 'removeAll');
      spyOn(view1, 'unbind');
      spyOn(view2, 'unbind');

      repeat.bind();

      expect(viewSlot.removeAll).toHaveBeenCalled();
      expect(view1.unbind).toHaveBeenCalled();
      expect(view2.unbind).toHaveBeenCalled();
    });
  });

  describe('itemsChanged', () => {
    it('should call disposeSubscription when has disposeSubscription', () => {
      let disposeSubscription = () => {};
      repeat.disposeSubscription = disposeSubscription;

      spyOn(repeat, 'disposeSubscription');

      repeat.itemsChanged();

      expect(repeat.disposeSubscription).toHaveBeenCalled();
    });

    it('should remove all and unbind all view when has disposeSubscription', () => {
      repeat.disposeSubscription = () => {};
      view1 = new ViewMock();
      view2 = new ViewMock();
      viewSlot.children = [view1, view2];

      spyOn(viewSlot, 'removeAll');
      spyOn(view1, 'unbind');
      spyOn(view2, 'unbind');

      repeat.itemsChanged();

      expect(viewSlot.removeAll).toHaveBeenCalled();
      expect(view1.unbind).toHaveBeenCalled();
      expect(view2.unbind).toHaveBeenCalled();
    });
  });
});
