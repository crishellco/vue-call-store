import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import constants from '../src/constants';
import VueRequestStore from '../src';

const identifier = 'identifier';
const message = 'message';
let localVue;
let store;

beforeEach(() => {
  localVue = createLocalVue();
  localVue.use(Vuex);
  store = new Vuex.Store();
  localVue.use(VueRequestStore, { store });
});

describe('module.js', () => {
  it('should start, end, and fail requests', () => {
    store.commit('requests/start', { identifier, message }, { root: true });
    expect(store.state.requests.requests[identifier].status).toBe(constants.PENDING);
    expect(store.state.requests.requests[identifier].message).toBe(message);

    store.commit('requests/end', { identifier, message }, { root: true });
    expect(store.state.requests.requests[identifier].status).toBe(constants.SUCCESS);

    store.commit('requests/fail', { identifier, message }, { root: true });
    expect(store.state.requests.requests[identifier].status).toBe(constants.FAILED);
  });
});
