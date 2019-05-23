import './setup';
import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { waitForFrames } from './test-utilities';

// https://github.com/aurelia/templating-resources/issues/378
fdescribe('repeat.issue-378.spec.ts', () => {
  it('works with <div repeat[Array] /> -->> <... matcher />', async () => {
    const model = new class {
      products = [
        { id: 0, name: 'Motherboard' },
        { id: 1, name: 'CPU' },
        { id: 2, name: 'Memory' }
      ];

      productMatcher = (a, b) => {
        return a.id === b.id;
      }

      selectedProduct = { id: 1, name: 'CPU' };
    };
    const component = StageComponent
      .withResources()
      .inView(`<label repeat.for="product of products">
          <input
            type="radio"
            name="group2"
            model.bind="product"
            matcher.bind="productMatcher"
            checked.bind="selectedProduct" />
          \${product.id} - \${product.name}
        </label>`)
      .boundTo(model);

    await component.create(bootstrap);
    const radios = document.querySelectorAll('input[type=radio]') as ArrayLike<HTMLInputElement>;
    expect(radios.length).toBe(3);
    expect(radios[1].checked).toBe(true);

    radios[2].click();
    await waitForFrames(1);

    expect(radios[1].checked).toBe(false);
    expect(radios[2].checked).toBe(true);
    expect(model.selectedProduct).toBe(model.products[2]);

    component.dispose();
  });

  it('works with <div repeat[Map] /> -->> <... matcher />', async () => {
    const model = new class {
      products = new Map([
        [0, 'Motherboard'],
        [1, 'CPU'],
        [2, 'Memory']
      ]);

      productMatcher = (a: [number, string], b: [number, string]) => {
        return a[0] === b[0];
      }

      selectedProduct = [1, 'CPU'];
    };
    const component = StageComponent
      .withResources()
      .inView(`<label repeat.for="[id, name] of products">
          <input
            type="radio"
            name="group2"
            model.bind="[id, name]"
            matcher.bind="productMatcher"
            checked.bind="selectedProduct" />
          \${id} - \${name}
        </label>`)
      .boundTo(model);

    await component.create(bootstrap);
    const radios = document.querySelectorAll('input[type=radio]') as ArrayLike<HTMLInputElement>;
    expect(radios.length).toBe(3);
    expect(radios[1].checked).toBe(true);

    radios[2].click();
    await waitForFrames(1);

    expect(radios[1].checked).toBe(false);
    expect(radios[2].checked).toBe(true);
    expect(model.selectedProduct).toEqual(Array.from(model.products)[2]);

    component.dispose();
  });

  describe('QA', () => {
    it('works with matcher', async () => {
      const model = new class App {
        components: any[];
        componentsAlternative: any;
        objComponents: any[];
        objComponentsAlternative: any[];
        amatcher: (a: any, b: any) => boolean;
        matcherCalls: number;

        constructor() {
          this.components = [];
          for (let i = 1; i <= 10; i++) {
            this.components.push(i);
          }
          this.componentsAlternative = this.components.slice(0).reverse();

          this.objComponents = [];
          this.objComponentsAlternative = [];
          for (let i = 1; i <= 10; i++) {
            this.objComponents.push({ id: i, text: i, cls: 'obj-comp' });
            this.objComponentsAlternative.push({ id: i, text: i - 1, cls: 'obj-comp-alt' });
          }

          this.matcherCalls = 0;
          this.amatcher = (a, b) => {
            this.matcherCalls++;
            return a.id === b.id;
          };
        }

        swapArrays() {
          [this.components, this.componentsAlternative] = [this.componentsAlternative, this.components];
          [this.objComponents, this.objComponentsAlternative] = [this.objComponentsAlternative, this.objComponents];
        }

        reverse() {
          this.components = this.components.slice(0).reverse();
          this.objComponents = this.objComponents.slice(0).reverse();
        }
      };
      const view = `
        <button click.delegate="swapArrays()">Swap arrays</button>
        <br>
        <template
          repeat.for="obj of objComponents"
          matcher.bind="amatcher"
          class="a-matcher \${obj.cls}">
          [\${$index}]
        </template>`;

      const component = StageComponent
        .withResources()
        .inView(view)
        .boundTo(model);

      await component.create(bootstrap);

      const viewModel = component.viewModel;
      expect(viewModel.matcher()).toBe(model.amatcher);
      expect(document.querySelectorAll('.obj-comp').length).toBe(10);

      model.swapArrays();
      await waitForFrames(2);

      expect(document.querySelectorAll('.obj-comp-alt').length).toBe(10);
      expect(model.matcherCalls).toBeGreaterThan(40);

      component.dispose();
    });
  });
});
