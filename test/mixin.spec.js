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
      <div v-if="$requests.isDone('${identifier}')" class="done">Hello World</div>
      <div v-if="$requests.isFailed('${identifier}')" class="failed">Hello World</div>
      <div v-if="$requests.isPending('${identifier}')" class="pending">Hello World</div>
    </div>
  `,
};

beforeEach(() => {
  localVue = createLocalVue();
  localVue.use(Vuex);
  store = new Vuex.Store();
  localVue.use(VueRequestStore, { store });

  wrapper = mount(component, { localVue, store });
});

describe('mixin.js', () => {
  it('should return the correct request', () => {
    store.commit('requests/start', { identifier, message });
    const request = wrapper.vm.$r.get(identifier);

    expect(request).toHaveProperty('message', message);
    expect(request).toHaveProperty('status', constants.PENDING);
    expect(request).toHaveProperty('_started');
    expect(request).toHaveProperty('_stopped');
    expect(request).toHaveProperty('_duration');
  });

  it('should update requests and return correct statuses', () => {
    wrapper.vm.$r.start(identifier);
    expect(wrapper.vm.$r.isPending(identifier)).toBe(true);

    wrapper.vm.$r.end(identifier);
    expect(wrapper.vm.$r.isDone(identifier)).toBe(true);

    wrapper.vm.$r.fail(identifier);
    expect(wrapper.vm.$r.isFailed(identifier)).toBe(true);
  });

  it('should update components', () => {
    wrapper.vm.$r.start(identifier);
    expect(wrapper.contains('.done')).toBe(false);
    expect(wrapper.contains('.failed')).toBe(false);
    expect(wrapper.contains('.pending')).toBe(true);

    wrapper.vm.$r.end(identifier);
    expect(wrapper.contains('.done')).toBe(true);
    expect(wrapper.contains('.failed')).toBe(false);
    expect(wrapper.contains('.pending')).toBe(false);

    wrapper.vm.$r.fail(identifier);
    expect(wrapper.contains('.done')).toBe(false);
    expect(wrapper.contains('.failed')).toBe(true);
    expect(wrapper.contains('.pending')).toBe(false);
  });
});
