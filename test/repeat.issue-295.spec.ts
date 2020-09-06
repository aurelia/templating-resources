import './setup';
import { StageComponent, ComponentTester } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { waitForFrames } from './test-utilities';
import { Repeat } from '../src/repeat';
import { customElement, inlineView, bindable } from 'aurelia-templating';

// https://github.com/aurelia/templating-resources/issues/295
describe('repeat.issue-295.spec.ts', () => {
  it('extracts matcher binding corectly when bind/unbind', async () => {
    let matcherCallCount = 0;

    @customElement('sample-element')
    @inlineView('<template></template>')
    class SampleElement {
      @bindable()
      item: any;

      // the issue happesn only when views inside a repeat[of an array] require lifecycle
      // need bind as a trigger
      bind() {/*  */}
    }

    @customElement('matcher-container')
    @inlineView(
      `<template>
        <div repeat.for="item of data" matcher.bind="matcher" class="item">
          <sample-element item.bind="item"></sample-element>
        </div>

        <button click.delegate="removeElement()">remove item</button>
        <button click.delegate="reset()">reset</button>
      </template>`
    )
    class MatcherContainer {
      data: any[] = [];

      bind() {
        this.data = [1, 2, 3];
      }

      removeElement() {
        this.data = this.data.filter(item => item !== 1);
      }

      reset() {
        matcherCallCount = 0;
        this.data = [1, 2, 3];
      }

      matcher(oldItem, newItem) {
        matcherCallCount++;
        return oldItem === newItem;
      }
    }

    const model = new class {
      showContainer = true;
    };
    const component: ComponentTester<Repeat> = StageComponent
      .withResources([MatcherContainer, SampleElement] as any)
      .inView(`<matcher-container if.bind="showContainer">`)
      .boundTo(model);

    await component.create(bootstrap);

    // step 1. verify everything works as normal
    expect(matcherCallCount).toBe(0);
    const host = component['host'] as HTMLElement;
    let buttons = host.querySelectorAll('button') as ArrayLike<HTMLButtonElement>;
    buttons[0].click();
    expect(host.querySelectorAll('.item').length).toBe(3);
    await waitForFrames(1);
    expect(host.querySelectorAll('.item').length).toBe(2);
    expect(matcherCallCount).toBeGreaterThanOrEqual(3);

    // step 2. verify matcher is working by changing the repeat data
    buttons[1].click();
    expect(matcherCallCount).toBe(0);
    await waitForFrames(1);
    expect(host.querySelectorAll('.item').length).toBe(3);
    expect(matcherCallCount).toBeGreaterThanOrEqual(3);

    // step 3. toggle the if and reset counter
    // this is needed to verify matcher working again later
    matcherCallCount = 0;
    model.showContainer = false;
    await waitForFrames(1);
    expect(host.querySelectorAll('.item').length).toBe(0);
    expect(matcherCallCount).toBe(0);

    // step 4. preparation similar to step 1 to test matcher working again in next step
    model.showContainer = true;
    await waitForFrames(1);
    expect(host.querySelectorAll('.item').length).toBe(3);
    expect(matcherCallCount).toBe(0);

    // step 5. verify matcher working again after toggling if on
    buttons = host.querySelectorAll('button') as ArrayLike<HTMLButtonElement>;
    buttons[0].click();
    expect(host.querySelectorAll('.item').length).toBe(3);
    await waitForFrames(1);
    expect(host.querySelectorAll('.item').length).toBe(2);
    expect(matcherCallCount).toBeGreaterThanOrEqual(3);
  });
});
