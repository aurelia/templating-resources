import './setup';
import {TaskQueue} from 'aurelia-task-queue';
import {Compose} from '../src/compose';

describe('Compose', () => {
  let elementMock;
  let containerMock;
  let compositionEngineMock;
  let viewSlotMock;
  let viewResourcesMock;
  let taskQueue;
  let sut;

  function updateBindable(name, value) {
    const oldValue = sut[name];
    sut[name] = value;
    if (typeof sut[`${name}Changed`] === 'function') {
      sut[`${name}Changed`](value, oldValue);
    }
  }

  function createMock() {
    return { [Math.random()]: Math.random() };
  }

  beforeEach(() => {
    sut = new Compose(
      elementMock = createMock(),
      containerMock = createMock(),
      compositionEngineMock = jasmine.createSpyObj('compositionEnine', ['compose']),
      viewSlotMock = jasmine.createSpyObj('viewSlot', ['removeAll']),
      viewResourcesMock = createMock(),
      taskQueue = new TaskQueue()
    );
    compositionEngineMock.compose.and.callFake(() => Promise.resolve());
  });

  describe('when created', () => {
    it('caches the owning view', () => {
      const owningView = {};
      sut.created(owningView);
      expect(sut.owningView).toBe(owningView);
    });
  });

  describe('when bound', () => {
    it('caches the binding and overridex contexts', () => {
      const bindingContext = {};
      const overrideContext = {};
      sut.bind(bindingContext, overrideContext);
      expect(sut.bindingContext).toBe(bindingContext);
      expect(sut.overrideContext).toBe(overrideContext);
    });
  });

  describe('when unbound', () => {
    it('clears the cached binding and override contexts', () => {
      const bindingContext = {};
      const overrideContext = {};
      sut.bind(bindingContext, overrideContext);
      sut.unbind();
      expect(sut.bindingContext).not.toBe(bindingContext);
      expect(sut.overrideContext).not.toBe(overrideContext);
    });

    it('clears the view', () => {
      sut.unbind();
      expect(viewSlotMock.removeAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('triggers composition', () => {
    it('when bound', () => {
      sut.bind();
      expect(compositionEngineMock.compose).toHaveBeenCalledTimes(1);
    });

    it('when "viewModel" changes', done => {
      const viewModel = './some-view-model';
      updateBindable('viewModel', viewModel);
      taskQueue.queueMicroTask(() => {
        expect(compositionEngineMock.compose).toHaveBeenCalledTimes(1);
        expect(compositionEngineMock.compose).toHaveBeenCalledWith(jasmine.objectContaining({ viewModel }));
        done();
      });
    });

    it('when "view" changes', done => {
      const view = './some-view.html';
      updateBindable('view', view);
      taskQueue.queueMicroTask(() => {
        expect(compositionEngineMock.compose).toHaveBeenCalledTimes(1);
        expect(compositionEngineMock.compose).toHaveBeenCalledWith(jasmine.objectContaining({ view }));
        done();
      });
    });
  });

  describe('does not trigger composition', () => {
    it('when only "model" or "swapOrder" change', done => {
      updateBindable('model', {});
      updateBindable('swapOrder', 'after');
      taskQueue.queueMicroTask(() => {
        expect(compositionEngineMock.compose).not.toHaveBeenCalled();
        done();
      });
    });
  });

  it('aggregates changes from single drain of the micro task queue', done => {
    const viewModel = createMock();
    const view = './some-view.html';
    const model = 42;
    updateBindable('viewModel', viewModel);
    updateBindable('model', model);
    updateBindable('view', view);
    taskQueue.queueMicroTask(() => {
      expect(compositionEngineMock.compose).toHaveBeenCalledTimes(1);
      expect(compositionEngineMock.compose).toHaveBeenCalledWith(jasmine.objectContaining({
        viewModel,
        view,
        model
      }));
      done();
    });
  });

  describe('"model" changed handler', () => {
    it('lets all other change handlers run before deciding whether there is a change requiring composition', done => { // TODO: name and position
      const model = 42;
      updateBindable('model', model);
      updateBindable('viewModel', './some-vm');
      taskQueue.queueMicroTask(() => {
        expect(compositionEngineMock.compose).toHaveBeenCalledWith(jasmine.objectContaining({ model }));
        done();
      });
    });

    it('activates the "currentViewModel" if there is no change requiring composition', done => {
      const model = 42;
      sut.currentViewModel = jasmine.createSpyObj('currentViewModelSpy', ['activate']);
      updateBindable('model', model);
      taskQueue.queueMicroTask(() => {
        expect(compositionEngineMock.compose).not.toHaveBeenCalled();
        expect(sut.currentViewModel.activate).toHaveBeenCalledTimes(1);
        expect(sut.currentViewModel.activate).toHaveBeenCalledWith(model);
        done();
      });
    });
  });

  describe('does not throw when trying to activate the "currentViewModel"', () => {
    it('if there is no such', done => {
      const task = jasmine.createSpyObj('notToThrowTaskSpy', ['onError']);
      task.call = () => {
        expect(task.onError).not.toHaveBeenCalled();
        done();
      };
      updateBindable('model', 42);
      taskQueue.queueMicroTask(task);
    });

    it('if it does not have an ".activate" hook', done => {
      const task = jasmine.createSpyObj('notToThrowTask', ['onError']);
      task.call = () => {
        expect(task.onError).not.toHaveBeenCalled();
        done();
      };
      sut.currentViewModel = {};
      updateBindable('model', 42);
      taskQueue.queueMicroTask(task);
    });
  });

  describe('builds "CompositionContext"', () => {
    it('from all available data', done => {
      sut.bindingContext = createMock();
      sut.overrideContext = createMock();
      sut.owningView = createMock();
      sut.currentController = createMock();
      const viewModel = './some-vm';
      const view = './some-view.html';
      const model = 42;
      const swapOrder = sut.swapOrder = 'after';
      updateBindable('viewModel', viewModel);
      updateBindable('view', view);
      updateBindable('model', model);
      taskQueue.queueMicroTask(() => {
        expect(compositionEngineMock.compose).toHaveBeenCalledWith(jasmine.objectContaining({
          viewModel,
          view,
          model,
          swapOrder,
          bindingContext: sut.bindingContext,
          overrideContext: sut.overrideContext,
          owningView: sut.owningView,
          container: containerMock,
          viewSlot: viewSlotMock,
          viewResources: viewResourcesMock,
          currentController: sut.currentController,
          host: elementMock
        }));
        done();
      });
    });

    describe('when "view" changes and "viewModel" not', () => {
      it('by using the view model from the last composition, if such', done => {
        const view = './some-view.html';
        sut.currentViewModel = createMock();
        updateBindable('view', view);
        taskQueue.queueMicroTask(() => {
          expect(compositionEngineMock.compose).toHaveBeenCalledTimes(1);
          expect(compositionEngineMock.compose).toHaveBeenCalledWith(jasmine.objectContaining({
            view,
            viewModel: sut.currentViewModel
          }));
          done();
        });
      });

      it('by using the "viewModel", if there is no view model from previous composition', done => {
        const view = './some-view.html';
        sut.viewModel = './some-view-model';
        updateBindable('view', view);
        taskQueue.queueMicroTask(() => {
          expect(compositionEngineMock.compose).toHaveBeenCalledTimes(1);
          expect(compositionEngineMock.compose).toHaveBeenCalledWith(jasmine.objectContaining({
            view,
            viewModel: sut.viewModel
          }));
          done();
        });
      });
    });
  });

  describe('after successul composition', () => {
    const controller = {
      viewModel: createMock()
    };
    let result;

    beforeEach(done => {
      compositionEngineMock.compose.and.stub;
      compositionEngineMock.compose.and.callFake(() => {
        result = Promise.resolve(controller);
        return result;
      });
      updateBindable('viewModel', './some-vm');
      taskQueue.queueMicroTask(done);
    });

    it('sets the current controller', done => {
      result.then(() => {
        expect(sut.currentController).toBe(controller);
        done()
      }, done.fail);
    });

    it('sets the current active view model', done => {
      result.then(() => {
        expect(sut.currentViewModel).toBe(controller.viewModel);
        done()
      }, done.fail);
    });
  });
});
