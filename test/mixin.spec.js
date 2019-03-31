import { mount } from '@vue/test-utils';
import Vue from 'vue';
import Vuex from 'vuex';

import constants from '../src/constants'
import mixin from '../src/mixin'
import module from '../src/module'

Vue.use(Vuex);

describe('mixin.js', () => {
  let store;
  let wrapper;

  const component = {
    mixins: [mixin],
    template: '<div>hello, world</div>',
  };

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        requests: module,
      },
    });

    wrapper = mount(component, { store });
  });

  it('should return the proper state of the request', () => {
    const identifier = 'identifier';
    const message = 'message';

    store.commit('requests/start', { identifier, message }, { root: true });
    expect(wrapper.vm.$r.isPending(identifier)).toBe(true);

    store.commit('requests/end', { identifier, message }, { root: true });
    expect(wrapper.vm.$r.isDone(identifier)).toBe(true);

    store.commit('requests/fail', { identifier, message }, { root: true });
    expect(wrapper.vm.$r.isFailed(identifier)).toBe(true);
  });

  it('should return the correct request', () => {
    const identifier = 'identifier';
    const message = 'message';

    store.commit('requests/start', { identifier, message }, { root: true });
    expect(wrapper.vm.$r.get(identifier)).toEqual({ message, status: constants.PENDING });
  });
});
