import { createLocalVue, mount } from '@vue/test-utils';
import Vuex from 'vuex';

import VueRequestStore from '../src';

const identifier = 'identifier';
let localVue;
let store;
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
  store = wrapper.vm.$store;
});

describe('directive.js', () => {
  it('should update components', async () => {
    wrapper.vm.$startRequest(identifier);

    await wrapper.vm.$forceUpdate();

    expect(wrapper.find('.done').isVisible()).toBe(false);
    expect(wrapper.find('.failed').isVisible()).toBe(false);
    expect(wrapper.find('.pending').isVisible()).toBe(true);

    wrapper.vm.$endRequest(identifier);

    await wrapper.vm.$forceUpdate();

    expect(wrapper.find('.done').isVisible()).toBe(true);
    expect(wrapper.find('.failed').isVisible()).toBe(false);
    expect(wrapper.find('.pending').isVisible()).toBe(false);

    wrapper.vm.$failRequest(identifier);

    await wrapper.vm.$forceUpdate();

    expect(wrapper.find('.done').isVisible()).toBe(false);
    expect(wrapper.find('.failed').isVisible()).toBe(true);
    expect(wrapper.find('.pending').isVisible()).toBe(false);
  });
});
