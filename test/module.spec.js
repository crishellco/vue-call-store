import Vue from 'vue';
import Vuex from 'vuex';

import constants from '../src/constants';
import module from '../src/module';

Vue.use(Vuex);

describe('module.js', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        requests: module,
      },
    });
  });

  it('should start, end, and fail requests', () => {
    const identifier = 'identifier';
    const message = 'message';

    store.commit('requests/start', { identifier, message }, { root: true });
    expect(store.state.requests.requests[identifier].status).toBe(constants.PENDING);
    expect(store.state.requests.requests[identifier].message).toBe(message);

    store.commit('requests/end', { identifier, message }, { root: true });
    expect(store.state.requests.requests[identifier].status).toBe(constants.SUCCESS);

    store.commit('requests/fail', { identifier, message }, { root: true });
    expect(store.state.requests.requests[identifier].status).toBe(constants.FAILED);
  });
});
