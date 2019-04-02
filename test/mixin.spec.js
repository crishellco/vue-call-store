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
    expect(wrapper.vm.$r.get(identifier)).toEqual({ message, status: constants.PENDING });
  });

  it('should update requests and return correct statuses', () => {
    wrapper.vm.$r.start(identifier);
    expect(wrapper.vm.$r.isPending(identifier)).toBe(true);

    wrapper.vm.$r.end(identifier);
    expect(wrapper.vm.$r.isDone(identifier)).toBe(true);

    wrapper.vm.$r.fail(identifier);
    expect(wrapper.vm.$r.isFailed(identifier)).toBe(true);
  });
});
