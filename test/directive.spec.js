import { createLocalVue, mount } from '@vue/test-utils';
import Vuex from 'vuex';

import constants from '../src/constants';
import VueRequestStore from '../src';

const identifier = 'identifier';
const message = 'message';
let localVue;
let store;
let wrapper;

const component = {
  template: `
    <div>
      <div v-request:done="'${identifier}'" class="done">Hello World</div>
      <div v-request:failed="'${identifier}'" class="failed">Hello World</div>
      <div v-request:pending="'${identifier}'" class="pending">Hello World</div>
    </div>
  `
};

beforeEach(() => {
  localVue = createLocalVue();
  localVue.use(Vuex);
  store = new Vuex.Store();
  localVue.use(VueRequestStore, { store });

  wrapper = mount(component, { localVue, store });
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
