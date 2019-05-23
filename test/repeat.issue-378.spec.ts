import './setup';
import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';

// https://github.com/aurelia/templating-resources/issues/378
fdescribe('repeat.issue-378.spec.ts', () => {
  it('with matcher', async () => {
    const component = StageComponent
      .withResources()
      .inView(`<label repeat.for="product of products">
          <input
            type="radio"
            name="group2"
            model.bind="product"
            matcherss.bind="productMatcher"
            checked.bind="selectedProduct" />
          \${product.id} - \${product.name}
        </label>`)
      .boundTo(new class {
        products = [
          { id: 0, name: 'Motherboard' },
          { id: 1, name: 'CPU' },
          { id: 2, name: 'Memory' }
        ];

        productMatcher = (a, b) => {
          console.log('matcher');
          return a.id === b.id;
        }

        selectedProduct = { id: 1, name: 'CPU' };
      });

    await component.create(bootstrap);
    const radios = document.querySelectorAll('input[type=radio]') as ArrayLike<HTMLInputElement>;
    expect(radios.length).toBe(3);
    expect(radios[1].checked).toBe(true);
  });
});
