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
  template: '<div>Hello World</div>',
};

beforeAll(() => {
  localVue = createLocalVue();
  localVue.use(Vuex);
  store = new Vuex.Store();
  localVue.use(VueRequestStore, { store });
  wrapper = mount(component, { localVue, store });
});

beforeEach(() => {
  store.commit('requests/reset', { root: true });
});

describe('mixin.js', () => {
  it('should return the correct request', () => {
    store.dispatch('requests/start', { identifier, message });
    const request = wrapper.vm.$getRequest(identifier);

    expect(request).toHaveProperty('message', message);
    expect(request).toHaveProperty('status', constants.PENDING);
    expect(request).toHaveProperty('_started');
    expect(request).toHaveProperty('_stopped');
    expect(request).toHaveProperty('_duration');
  });

  it('should update requests and return correct statuses', () => {
    wrapper.vm.$startRequest(identifier);
    expect(wrapper.vm.$isPending(identifier)).toBe(true);

    wrapper.vm.$endRequest(identifier);
    expect(wrapper.vm.$isDone(identifier)).toBe(true);

    wrapper.vm.$failRequest(identifier);
    expect(wrapper.vm.$isFailed(identifier)).toBe(true);
  });
});
