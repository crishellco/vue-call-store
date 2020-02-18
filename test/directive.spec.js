import { createLocalVue, mount } from '@vue/test-utils';

import VueRequestStore from '../src';

const identifier = 'identifier';
let localVue;
let wrapper;

const component = {
  template: `
    <div>
      <div v-request:done="'${identifier}'" class="done">Hello World</div>
      <div v-request:failed="['${identifier}', 'second']" class="failed">Hello World</div>
      <div v-request:pending="['${identifier}', 'third']" class="pending">Hello World</div>
    </div>
  `
};

beforeEach(() => {
  localVue = createLocalVue();
  localVue.use(VueRequestStore);
  wrapper = mount(component, { localVue });
});

describe('directive.js', () => {
  it('should update components', async () => {
    wrapper.vm.$startRequest(identifier);

    await wrapper.vm.$forceUpdate();

    expect(wrapper.find('.done').exists()).toBe(false);
    expect(wrapper.find('.failed').exists()).toBe(false);
    expect(wrapper.find('.pending').exists()).toBe(true);

    wrapper.vm.$endRequest(identifier);

    await wrapper.vm.$forceUpdate();

    expect(wrapper.find('.done').exists()).toBe(true);
    expect(wrapper.find('.failed').exists()).toBe(false);
    expect(wrapper.find('.pending').exists()).toBe(false);

    wrapper.vm.$failRequest(identifier);

    await wrapper.vm.$forceUpdate();

    expect(wrapper.find('.done').exists()).toBe(false);
    expect(wrapper.find('.failed').exists()).toBe(true);
    expect(wrapper.find('.pending').exists()).toBe(false);
  });
});
