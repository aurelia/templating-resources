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

  fit('should render when initial condition is false', () => {
    ifVm.showing = false;
    elseVm.showing = false;

    spyOn(ifViewSlot, 'add');
    spyOn(ifVm.view, 'bind');
    spyOn(elseViewSlot, 'add');
    spyOn(elseVm.view, 'bind');

    ifVm.condition = false;
    ifVm.bind();
    // Nothing should happen yet since else is not bound yet
    expect(ifViewSlot.add).not.toHaveBeenCalled();
    expect(ifVm.view.bind).not.toHaveBeenCalled();
    expect(elseViewSlot.add).not.toHaveBeenCalled();
    expect(elseVm.view.bind).not.toHaveBeenCalled();

    elseVm.isBound = true;
    elseVm.bind();
    // Else should be shown now
    expect(ifVm.showing).toBeFalsy();
    expect(ifViewSlot.add).not.toHaveBeenCalled();
    expect(ifVm.view.bind).not.toHaveBeenCalled();
    expect(elseVm.showing).toBeTruthy();
    expect(elseViewSlot.add).toHaveBeenCalled();
    expect(elseVm.view.bind).toHaveBeenCalled();
  });

  fit('should not render when initial condition is true', () => {
    ifVm.showing = false;
    elseVm.showing = false;

    spyOn(elseViewSlot, 'add');
    spyOn(elseVm.view, 'bind');
    spyOn(ifViewSlot, 'add');
    spyOn(ifVm.view, 'bind');

    ifVm.condition = true;
    ifVm.bind();
    // Nothing should happen yet since else is not bound yet
    expect(elseViewSlot.add).not.toHaveBeenCalled();
    expect(elseVm.view.bind).not.toHaveBeenCalled();
    expect(ifViewSlot.add).not.toHaveBeenCalled();
    expect(ifVm.view.bind).not.toHaveBeenCalled();

    elseVm.isBound = true;
    elseVm.bind();
    // If should be shown now
    expect(elseVm.showing).toBeFalsy();
    expect(elseViewSlot.add).not.toHaveBeenCalled(); // Was not added yet
    expect(elseVm.view.bind).not.toHaveBeenCalled(); // Was not added yet
    expect(ifVm.showing).toBeTruthy();
    expect(ifViewSlot.add).toHaveBeenCalled();
    expect(ifVm.view.bind).toHaveBeenCalled();
  });

  fit('should render when condition changes to false', () => {
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
    elseVm.isBound = true;
    elseVm.bind();
    // Nothing should happen yet since else is not bound yet
    expect(ifVm.showing).toBeTruthy();
    expect(ifViewSlot.add).toHaveBeenCalled();
    expect(ifVm.view.bind).toHaveBeenCalled();
    expect(elseVm.showing).toBeFalsy();
    expect(elseViewSlot.add).not.toHaveBeenCalled();
    expect(elseVm.view.bind).not.toHaveBeenCalled();

    ifVm.condition = false;
    ifVm.bind();

    // Else should be shown now and if should be removed
    expect(ifVm.showing).toBeFalsy();
    expect(ifViewSlot.remove).toHaveBeenCalled(); // Was not added yet
    expect(ifVm.view.unbind).toHaveBeenCalled(); // Was not added yet
    expect(elseVm.showing).toBeTruthy();
    expect(elseViewSlot.add).toHaveBeenCalled();
    expect(elseVm.view.bind).toHaveBeenCalled();
  });

  fit('should render when condition changes to true', () => {
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
    elseVm.isBound = true;
    elseVm.bind();
    // Nothing should happen yet since else is not bound yet
    expect(ifVm.showing).toBeFalsy();
    expect(ifViewSlot.add).not.toHaveBeenCalled();
    expect(ifVm.view.bind).not.toHaveBeenCalled();
    expect(elseVm.showing).toBeTruthy();
    expect(elseViewSlot.add).toHaveBeenCalled();
    expect(elseVm.view.bind).toHaveBeenCalled();

    ifVm.condition = true;
    ifVm.bind();

    // Else should be shown now and if should be removed
    expect(ifVm.showing).toBeTruthy();
    expect(ifViewSlot.add).toHaveBeenCalled(); // Was not added yet
    expect(ifVm.view.bind).toHaveBeenCalled(); // Was not added yet
    expect(elseVm.showing).toBeFalsy();
    expect(elseViewSlot.remove).toHaveBeenCalled();
    expect(elseVm.view.unbind).toHaveBeenCalled();
  });
});
