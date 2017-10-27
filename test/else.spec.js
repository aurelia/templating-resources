import './setup';
import {ViewSlot} from 'aurelia-templating';
import {If} from '../src/if';
import {Else} from '../src/else';

class ViewMock {
  bind() {}
  unbind() {}
}

describe('else', () => {
  let ifViewSlot, elseViewSlot, ifVm, elseVm, viewFactory;

  beforeEach(() => {
    const fragment = document.createDocumentFragment();
    const ifNode = document.createElement('div');
    const elseNode = document.createElement('div');
    fragment.appendChild(ifNode);
    fragment.appendChild(elseNode);
    ifViewSlot = new ViewSlot(ifNode, true);
    elseViewSlot = new ViewSlot(elseNode, true);
    ifVm = new If(viewFactory, ifViewSlot);
    ifVm.view = new ViewMock();
    ifNode.au = {if: {viewModel: ifVm}};

    elseVm = new Else(viewFactory, elseViewSlot);
    elseVm.view = new ViewMock();
  });

  it('should render when initial condition is false', () => {
    ifVm.showing = false;
    elseVm.showing = false;

    spyOn(ifViewSlot, 'add');
    spyOn(ifVm.view, 'bind');
    spyOn(elseViewSlot, 'add');
    spyOn(elseVm.view, 'bind');

    ifVm.condition = false;
    ifVm.bind();
    elseVm.bind();
    // Else should be shown now
    expect(ifVm.showing).toBeFalsy();
    expect(ifViewSlot.add).not.toHaveBeenCalled();
    expect(ifVm.view.bind).not.toHaveBeenCalled();
    expect(elseVm.showing).toBeTruthy();
    expect(elseViewSlot.add).toHaveBeenCalledTimes(1);
    expect(elseVm.view.bind).toHaveBeenCalledTimes(1);
  });

  it('should not render when initial condition is true', () => {
    ifVm.showing = false;
    elseVm.showing = false;

    spyOn(elseViewSlot, 'add');
    spyOn(elseVm.view, 'bind');
    spyOn(ifViewSlot, 'add');
    spyOn(ifVm.view, 'bind');

    ifVm.condition = true;
    ifVm.bind();
    elseVm.bind();
    // If should be shown now
    expect(elseVm.showing).toBeFalsy();
    expect(elseViewSlot.add).not.toHaveBeenCalled(); // Was not added yet
    expect(elseVm.view.bind).not.toHaveBeenCalled(); // Was not added yet
    expect(ifVm.showing).toBeTruthy();
    expect(ifViewSlot.add).toHaveBeenCalledTimes(1);
    expect(ifVm.view.bind).toHaveBeenCalledTimes(1);
  });

  it('should render when condition changes to false', () => {
    ifVm.showing = false;
    elseVm.showing = false;

    spyOn(ifViewSlot, 'add');
    spyOn(ifVm.view, 'bind');
    spyOn(ifViewSlot, 'remove');
    spyOn(ifVm.view, 'unbind');
    spyOn(elseViewSlot, 'add');
    spyOn(elseVm.view, 'bind');

    ifVm.condition = true;
    ifVm.bind();
    elseVm.bind();
    // Nothing should happen yet since else is not bound yet
    expect(ifVm.showing).toBeTruthy();
    expect(ifViewSlot.add).toHaveBeenCalledTimes(1);
    expect(ifVm.view.bind).toHaveBeenCalledTimes(1);
    expect(elseVm.showing).toBeFalsy();
    expect(elseViewSlot.add).not.toHaveBeenCalled();
    expect(elseVm.view.bind).not.toHaveBeenCalled();

    ifVm.condition = false;
    ifVm.conditionChanged(false);

    // Else should be shown now and if should be removed
    expect(ifVm.showing).toBeFalsy();
    expect(ifViewSlot.remove).toHaveBeenCalledTimes(1);
    expect(ifVm.view.unbind).toHaveBeenCalledTimes(1);
    expect(elseVm.showing).toBeTruthy();
    expect(elseViewSlot.add).toHaveBeenCalledTimes(1);
    expect(elseVm.view.bind).toHaveBeenCalledTimes(1);
  });

  it('should render when condition changes to true', () => {
    ifVm.showing = false;
    elseVm.showing = false;

    spyOn(ifViewSlot, 'add');
    spyOn(ifVm.view, 'bind');
    spyOn(elseViewSlot, 'add');
    spyOn(elseVm.view, 'bind');
    spyOn(elseViewSlot, 'remove');
    spyOn(elseVm.view, 'unbind');

    ifVm.condition = false;
    ifVm.bind();
    elseVm.bind();
    // Nothing should happen yet since else is not bound yet
    expect(ifVm.showing).toBeFalsy();
    expect(ifViewSlot.add).not.toHaveBeenCalled();
    expect(ifVm.view.bind).not.toHaveBeenCalled();
    expect(elseVm.showing).toBeTruthy();
    expect(elseViewSlot.add).toHaveBeenCalledTimes(1);
    expect(elseVm.view.bind).toHaveBeenCalledTimes(1);

    ifVm.condition = true;
    ifVm.conditionChanged(true);

    // Else should be shown now and if should be removed
    expect(ifVm.showing).toBeTruthy();
    expect(ifViewSlot.add).toHaveBeenCalledTimes(1);
    expect(ifVm.view.bind).toHaveBeenCalledTimes(1);
    expect(elseVm.showing).toBeFalsy();
    expect(elseViewSlot.remove).toHaveBeenCalledTimes(1);
    expect(elseVm.view.unbind).toHaveBeenCalledTimes(1);
  });

  it('should re-bind the child-view when being bound itself and condition is falsy', () => {
    ifVm.condition = false;
    elseVm.showing = true;
    elseVm.view = new ViewMock();

    spyOn(elseVm.view, 'bind');

    let bindingContext = 42;
    let overrideContext = 24;

    spyOn(elseVm, '_show').and.callThrough();

    elseVm.bind(bindingContext, overrideContext);

    expect(elseVm._show).toHaveBeenCalled();
    expect(elseVm.view.bind).toHaveBeenCalled();
  });
});
