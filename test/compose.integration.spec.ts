import './setup';
import { StageComponent, ComponentTester } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { Compose, ActivationStrategy } from '../src/compose';
import { InlineViewStrategy, useView, TaskQueue } from 'aurelia-framework';

describe('compose.integration.spec.ts', () => {

  it('composes with string as view model', async () => {
    const { component } = await bootstrapCompose(
      `<compose view-model="test/resources/view-model-1"></compose>`
    );

    expect(component.element.querySelector('.view-model-1')).not.toBe(null, '.view-model-1 exists');

    component.dispose();
  });

  it('works with @useView', async () => {
    let instanceCount = 0;

    @useView('test/resources/view-model-1.html')
    class ViewModelClass {
      constructor() {
        instanceCount++;
      }
    }
    const { component } = await bootstrapCompose(
      `<compose view-model.bind="viewModel"></compose>`,
      {
        viewModel: ViewModelClass
      }
    );

    expect(component.element.textContent.trim()).toBe('', 'empty view');
    expect(instanceCount).toBe(1, 'instance count === 1');

    component.dispose();
  });

  it('works with static view strategy $view', async () => {
    let instanceCount = 0;
    const { component } = await bootstrapCompose(
      `<compose view-model.bind="viewModel"></compose>`,
      {
        viewModel: class {
          static $view = '<template></template>';
          constructor() {
            instanceCount++;
          }
        }
      }
    );

    expect(component.element.innerHTML).toBe('', 'empty view');
    expect(instanceCount).toBe(1, 'instance count === 1');

    component.dispose();
  });

  it('works with getViewStrategy()', async () => {
    let instanceCount = 0;
    const { component } = await bootstrapCompose(
      `<compose view-model.bind="viewModel"></compose>`,
      {
        viewModel: class {
          constructor() {
            instanceCount++;
          }

          getViewStrategy() {
            return new InlineViewStrategy('<template></template>');
          }
        }
      }
    );

    expect(component.element.innerHTML).toBe('', 'empty view');
    expect(instanceCount).toBe(1, 'instance count === 1');

    component.dispose();
  });

  it('works with determineActivationStrategy() - replace', async () => {
    const { component, compose } = await bootstrapCompose(
      `<compose view-model.bind="viewModel"></compose>`,
      {
        viewModel: class {
          // w/o the get view strategy, the initial composition fails, which results to undefined currentViewModel
          getViewStrategy() {
            return new InlineViewStrategy('<template></template>');
          }

          determineActivationStrategy() {
            return ActivationStrategy.Replace;
          }
        }
      }
    );

    const taskQueue = new TaskQueue();
    spyOn(compose.compositionEngine, 'compose').and.callThrough();
    const oldModel = compose.model;
    compose.modelChanged({ a: 1 }, oldModel);

    taskQueue.queueMicroTask(() => {
      expect(compose.compositionEngine.compose).toHaveBeenCalledTimes(1);
      component.dispose();
    });

  });

  it('works with determineActivationStrategy() - invoke-lifecycle', async () => {
    let activationCount = 0;
    const { component, compose } = await bootstrapCompose(
      `<compose view-model.bind="viewModel"></compose>`,
      {
        viewModel: class {
          activate() {
            activationCount++;
          }

          // w/o the get view strategy, the initial composition fails, which results to undefined currentViewModel
          getViewStrategy() {
            return new InlineViewStrategy('<template></template>');
          }

          determineActivationStrategy() {
            return ActivationStrategy.InvokeLifecycle;
          }
        }
      }
    );

    const taskQueue = new TaskQueue();

    const oldModel = compose.model;
    compose.modelChanged({}, oldModel);

    taskQueue.queueMicroTask(() => {
      expect(activationCount).toBe(2, 'activation count === 2');
      component.dispose();
    });
  });

  [1, true, 'chaos', new Date(1900, 1, 1), {}].map((strategy) =>
    it(`applies invoke-lifecycle strategy when determineActivationStrategy() returns unknown value such as ${strategy}`, async () => {
      let activationCount = 0;
      const { component, compose } = await bootstrapCompose(
        `<compose view-model.bind="viewModel"></compose>`,
        {
          viewModel: class {
            activate() {
              activationCount++;
            }

            // w/o the get view strategy, the initial composition fails, which results to undefined currentViewModel
            getViewStrategy() {
              return new InlineViewStrategy('<template></template>');
            }

            determineActivationStrategy() {
              return strategy;
            }
          }
        }
      );

      const taskQueue = new TaskQueue();

      const oldModel = compose.model;
      compose.modelChanged({}, oldModel);

      taskQueue.queueMicroTask(() => {
        expect(activationCount).toBe(2, 'activation count === 2');
        component.dispose();
      });
    }));

  describe('scope traversing', () => {
    it('traverses scope by default', async () => {
      const { component } = await bootstrapCompose(
        `<compose view-model.bind="viewModel"></compose>`,
        {
          message: 'hello',
          viewModel: class {
            static $view = '<template>${message}</template>';
          }
        }
      );

      expect(component.element.innerHTML).toBe('hello');
      component.dispose();
    });

    it('does not traverse scope if composed viewmodel has the property', async () => {
      const { component } = await bootstrapCompose(
        `<compose view-model.bind="viewModel"></compose>`,
        {
          message: 'hello',
          viewModel: class {
            static $view = '<template>${message}</template>';
            message = 'hello 2';
          }
        }
      );

      expect(component.element.innerHTML).toBe('hello 2');
      component.dispose();
    });

    it('traverses all the way', async () => {
      const { component } = await bootstrapCompose(
        `<compose view-model.bind="viewModel"></compose>`,
        {
          message: 'hello',
          viewModel: class {
            static $view = '<template>${message}<compose view-model.bind="viewModel2"></compose></template>';
          },
          viewModel2: class {
            static $view = '<template>${message}</template>';
          }
        }
      );

      expect(component.element.textContent).toBe('hellohello');
      component.dispose();
    });

    // commented out waiting for future work
    // xit('does not traverse when there "inherit-binding-context=false"', async () => {
    //   const { component, compose } = await bootstrapCompose(
    //     `<compose view-model.bind="viewModel" inherit-binding-context="false"></compose>`,
    //     {
    //       message: 'hello',
    //       viewModel: class {
    //         static $view = '<template>${message}</template>';
    //       }
    //     }
    //   );

    //   expect(compose.inheritBindingContext).toBe('false', 'compose.inheritBindingContext === false');
    //   expect(component.element.innerHTML).toBe('');
    //   component.dispose();
    // });

    // xit('does not traverse when there "inherit-binding-context=false"', async () => {
    //   const { component, compose } = await bootstrapCompose(
    //     `<compose view-model.bind="viewModel" inherit-binding-context.bind="false"></compose>`,
    //     {
    //       message: 'hello',
    //       viewModel: class {
    //         static $view = '<template>${message}</template>';
    //       }
    //     }
    //   );

    //   expect(compose.inheritBindingContext).toBe('false', 'compose.inheritBindingContext === false');
    //   expect(component.element.innerHTML).toBe('');
    //   component.dispose();
    // });
  });

  const bootstrapCompose = async <T>(view?: string, viewModel?: T) => {
    const component: ComponentTester<Compose> = StageComponent
      .withResources()
      .inView(view || '<compose></compose>')
      .boundTo(viewModel || {});

    await component.create(bootstrap);

    return {
      component,
      compose: component.viewModel,
      viewModel
    };
  };
});
