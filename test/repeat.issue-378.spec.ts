import './setup';
import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { waitForFrames } from './test-utilities';

// https://github.com/aurelia/templating-resources/issues/378
fdescribe('repeat.issue-378.spec.ts', () => {
  it('works with matcher, on a real element, + array', async () => {
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
      .inView(`<label repeat.for="product of products" a.bind="product">
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
});
