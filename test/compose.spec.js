import './setup';
import { TaskQueue } from 'aurelia-task-queue';
import { Compose } from '../src/compose';
import * as LogManager from 'aurelia-logging';

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
    it('caches the binding and override contexts', () => {
      const bindingContext = {};
      const overrideContext = {};
      sut.bind(bindingContext, overrideContext);
      expect(sut.bindingContext).toBe(bindingContext);
      expect(sut.overrideContext).toBe(overrideContext);
    });

    it('awaits ongoing update from previous lifecycle', done => {
      compositionEngineMock.compose.and.stub();
      // makes updates longer
      compositionEngineMock.compose.and.callFake(() => new Promise(resolve => setTimeout(resolve, 600)));
      // make first bind
      sut.viewModel = 'some-vm';
      sut.bind({}, {});
      expect(sut.pendingTask).toBeDefined();
      const taskFromFirstBind = sut.pendingTask;

      // await some time and unbind
      setTimeout(() => {
        sut.unbind();
        // the work from the initial bind should still be ongoing
        expect(sut.pendingTask).toBe(taskFromFirstBind);
      }, 100);

      // do a second bind after unbinding
      setTimeout(() => {
        // the work from the initial bind should still be ongoing
        expect(sut.pendingTask).toBe(taskFromFirstBind);
        sut.viewModel = 'new-vm';
        sut.model = {};
        sut.bind({}, {});
        // the new bind should not modify ongoing work
        expect(sut.pendingTask).toBe(taskFromFirstBind);
        taskFromFirstBind.then(() => {
          // the initial work is done
          // the scheduled changes should be processed
          // there should be new ongoing work - from the processed changes
          expect(sut.pendingTask).toBeDefined();
          expect(sut.pendingTask).not.toBe(taskFromFirstBind);
          done();
        });
      }, 300);
    });
  });

  describe('when unbound', () => {
    it('clears the cached binding and override contexts', () => {
      const bindingContext = sut.bindingContext = {};
      const overrideContext = sut.overrideContext = {};
      sut.unbind();
      expect(sut.bindingContext).not.toBe(bindingContext);
      expect(sut.overrideContext).not.toBe(overrideContext);
    });

    it('clears the view', () => {
      sut.unbind();
      expect(viewSlotMock.removeAll).toHaveBeenCalledTimes(1);
    });

    it('clears any scheduled changes', () => {
      const expectedChanges = Object.create(null);
      sut.changes = expectedChanges;
      sut.unbind();
      expect(sut.changes).toBeDefined();
      expect(sut.changes).not.toBe(expectedChanges);
    })
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

  it('awaits the current composition/activation before applying next set of changes', done => {
    compositionEngineMock.compose.and.stub();
    compositionEngineMock.compose.and.callFake(() => new Promise(resolve => setTimeout(resolve, 600)));
    updateBindable('viewModel', './some-vm');

    taskQueue.queueMicroTask(() => setTimeout(() => {
      expect(compositionEngineMock.compose).toHaveBeenCalledTimes(1);

      const setOne = {
        model: 2,
        view: './view.html'
      };
      const setTwo = {
        model: 42,
        viewModel: './truth'
      };
      const endSet = Object.assign({}, setOne, setTwo);

      sut.pendingTask.then(() => {
        expect(Object.keys(sut.changes).length).toBe(0);
        expect(compositionEngineMock.compose).toHaveBeenCalledTimes(2);
        expect(compositionEngineMock.compose).toHaveBeenCalledWith(jasmine.objectContaining(endSet));
        done();
      });

      updateBindable('model', setOne.model);
      updateBindable('view', setOne.view);

      setTimeout(() => {
        expect(sut.changes).toEqual(jasmine.objectContaining(setOne));
        expect(compositionEngineMock.compose).toHaveBeenCalledTimes(1);
        updateBindable('model', setTwo.model);
        updateBindable('viewModel', setTwo.viewModel);
      }, 100);
      setTimeout(() => {
        expect(sut.changes).toEqual(jasmine.objectContaining(endSet));
        expect(compositionEngineMock.compose).toHaveBeenCalledTimes(1);
      }, 300);
    }, 0));
  });

  describe('after successul composition', () => {
    const controller = {
      viewModel: createMock()
    };

    beforeEach(done => {
      compositionEngineMock.compose.and.stub;
      compositionEngineMock.compose.and.callFake(() => new Promise(resolve => setTimeout(() => resolve(controller), 20)));
      updateBindable('viewModel', './some-vm');
      taskQueue.queueMicroTask(done);
    });

    it('sets the current controller', done => {
      sut.pendingTask.then(() => {
        expect(sut.currentController).toBe(controller);
        done()
      }, done.fail);
    });

    it('sets the current active view model', done => {
      sut.pendingTask.then(() => {
        expect(sut.currentViewModel).toBe(controller.viewModel);
        done()
      }, done.fail);
    });

    it('processes pending changes', done => {
      expect(sut.pendingTask).toBeTruthy();
      expect(sut.changes['viewModel']).not.toBeDefined();
      setTimeout(() => {
        const vm = './some-other-vm';
        updateBindable('viewModel', vm);
        expect(sut.changes['viewModel']).toBeDefined();
        sut.pendingTask.then(() => {
          expect(sut.changes['viewModel']).not.toBeDefined();
          return sut.pendingTask;
        }).then(done).catch(done.fail);
      }, 0);
    });

    it('clears pending composition', done => {
      sut.pendingTask.then(() => {
        expect(sut.pendingTask).not.toBeTruthy();
        done();
      }).catch(done.fail);
    });
  });

  describe('after failing a composition', () => {
    let error;
    beforeEach(done => {
      compositionEngineMock.compose.and.stub;
      compositionEngineMock.compose.and.callFake(() => Promise.reject(error = new Error('".compose" test error')));
      updateBindable('viewModel', './some-vm');
      taskQueue.queueMicroTask(done);
    });

    it('re-throws errors', done => {
      sut.pendingTask.then(() => done.fail('"pendingTask" should be rejected'), reason => {
        expect(reason).toBe(error);
        done();
      });
    });

    it('completes pending composition', done => {
      sut.pendingTask.then(() => done.fail('"pendingTask" should be rejected'), () => {
        expect(sut.pendingTask).not.toBeTruthy();
        done();
      });
    });
  });
});
