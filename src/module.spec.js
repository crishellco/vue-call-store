import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import VueCallStore from '.';
import constants from './constants';

const minDuration = 2000;
const identifier = 'identifier';
const message = 'message';
let localVue;
let store;

beforeEach(() => {
  localVue = createLocalVue();
  localVue.use(Vuex);
  store = new Vuex.Store();
  localVue.use(VueCallStore, { minDuration, store });

  store.commit('calls/RESET', { root: true });
});

describe('module.js', () => {
  it('should correctly return data from getters', () => {
    store.state.calls.calls = 'calls!';

    expect(store.getters['calls/calls']).toBe('calls!');
  });

  it('should start, end, and fail calls', async () => {
    const secondIdentifier = 'secondIdentifier';
    const thirdIdentifier = 'thirdIdentifier';
    const fourthIdentifier = 'fourthIdentifier';

    await store.dispatch('calls/end', { identifier: thirdIdentifier }, { root: true });
    await store.dispatch('calls/start', { identifier: secondIdentifier }, { root: true });
    await store.dispatch('calls/start', { identifier, message }, { root: true });
    await store.dispatch('calls/fail', { identifier: fourthIdentifier }, { root: true });

    expect(store.state.calls.calls[identifier].status).toBe(constants.PENDING);
    expect(store.state.calls.calls[identifier].message).toBe(message);
    expect(store.getters['calls/pending'].sort()).toEqual([identifier, secondIdentifier].sort());

    await store.dispatch('calls/end', { identifier, message }, { root: true });
    expect(store.state.calls.calls[identifier].status).toBe(constants.DONE);
    expect(store.state.calls.calls[identifier]._duration).toBeGreaterThanOrEqual(minDuration);
    expect(store.getters['calls/done'].sort()).toEqual([identifier, thirdIdentifier].sort());

    await store.dispatch('calls/fail', { identifier, message }, { root: true });
    expect(store.state.calls.calls[identifier].status).toBe(constants.FAILED);
    expect(store.getters['calls/failed'].sort()).toEqual([identifier, fourthIdentifier].sort());
  });

  it('should respect global minDuration when not using async/await', () => {
    store.dispatch('calls/start', { identifier }, { root: true });
    store.dispatch('calls/end', { identifier }, { root: true });

    expect(store.getters['calls/done']).toEqual([]);
  });

  it('should respect global minDuration when using async/await', async () => {
    await store.dispatch('calls/start', { identifier }, { root: true });
    await store.dispatch('calls/end', { identifier }, { root: true });

    expect(store.getters['calls/done']).toEqual([identifier]);
  });

  it('should respect override minDuration when using async/await', async () => {
    const override = 4000;
    const startDate = new Date();

    await store.dispatch('calls/start', { identifier }, { root: true });
    await store.dispatch('calls/end', { identifier, minDuration: override }, { root: true });

    const endDate = new Date();

    expect(store.getters['calls/done']).toEqual([identifier]);
    expect(Math.abs(startDate - endDate)).toBeGreaterThanOrEqual(override);
  });
});
