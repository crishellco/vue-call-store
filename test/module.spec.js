import { createLocalVue } from '@vue/test-utils';
import mockdate from 'mockdate';
import dayjs from 'dayjs';
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

  store.commit('requests/reset', { root: true });
});

describe('module.js', () => {
  it('should correctly return data from getters', () => {
    store.state.requests.requests = 'requests!';

    expect(store.getters['requests/requests']).toBe('requests!');
  });

  it('should start, end, and fail requests', () => {
    const secondIdentifier = 'secondIdentifier';
    const thirdIdentifier = 'thirdIdentifier';
    const fourthIdentifier = 'fourthIdentifier';

    store.commit('requests/start', { identifier, message }, { root: true });
    store.commit('requests/start', { identifier: secondIdentifier }, { root: true });
    store.commit('requests/end', { identifier: thirdIdentifier }, { root: true });
    store.commit('requests/fail', { identifier: fourthIdentifier }, { root: true });

    expect(store.state.requests.requests[identifier].status).toBe(constants.PENDING);
    expect(store.state.requests.requests[identifier].message).toBe(message);
    expect(store.getters['requests/pending']).toEqual([identifier, secondIdentifier]);

    store.commit('requests/end', { identifier, message }, { root: true });
    expect(store.state.requests.requests[identifier].status).toBe(constants.DONE);
    expect(store.getters['requests/done']).toEqual([identifier, thirdIdentifier]);

    store.commit('requests/fail', { identifier, message }, { root: true });
    expect(store.state.requests.requests[identifier].status).toBe(constants.FAILED);
    expect(store.getters['requests/failed']).toEqual([identifier, fourthIdentifier]);
  });

  it('should add meta data', () => {
    const started = dayjs();
    const stopped = started.clone().add(200, 'ms');

    mockdate.set(started.toDate());

    store.commit('requests/start', { identifier, message }, { root: true });
    expect(store.state.requests.requests[identifier]).toEqual({
      _duration: null,
      _started: started,
      _stopped: null,
      message,
      status: constants.PENDING
    });

    mockdate.set(stopped.toDate());

    store.commit('requests/end', { identifier, message }, { root: true });
    expect(store.state.requests.requests[identifier]).toEqual({
      _duration: 200,
      _started: started,
      _stopped: stopped,
      message,
      status: constants.DONE
    });

    store.commit('requests/fail', { identifier, message }, { root: true });
    expect(store.state.requests.requests[identifier]).toEqual({
      _duration: 200,
      _started: started,
      _stopped: stopped,
      message,
      status: constants.FAILED
    });

    store.commit('requests/reset', { root: true });

    store.commit('requests/fail', { identifier, message }, { root: true });
    expect(store.state.requests.requests[identifier]).toEqual({
      _duration: 0,
      _started: stopped,
      _stopped: stopped,
      message,
      status: constants.FAILED
    });
  });
});
