import { createLocalVue } from '@vue/test-utils';
import mockdate from 'mockdate';
import dayjs from 'dayjs';
import Vuex from 'vuex';

import constants from '../src/constants';
import VueCallStore from '../src';

const identifier = 'identifier';
const message = 'message';
let localVue;
let store;

beforeEach(() => {
  localVue = createLocalVue();
  localVue.use(Vuex);
  store = new Vuex.Store();
  localVue.use(VueCallStore, { store });

  store.commit('calls/RESET', { root: true });
});

describe('module.js', () => {
  it('should correctly return data from getters', () => {
    store.state.calls.calls = 'calls!';

    expect(store.getters['calls/calls']).toBe('calls!');
  });

  it('should start, end, and fail calls', () => {
    const secondIdentifier = 'secondIdentifier';
    const thirdIdentifier = 'thirdIdentifier';
    const fourthIdentifier = 'fourthIdentifier';

    store.commit('calls/START', { identifier, message }, { root: true });
    store.commit('calls/START', { identifier: secondIdentifier }, { root: true });
    store.commit('calls/END', { identifier: thirdIdentifier }, { root: true });
    store.commit('calls/FAIL', { identifier: fourthIdentifier }, { root: true });

    expect(store.state.calls.calls[identifier].status).toBe(constants.PENDING);
    expect(store.state.calls.calls[identifier].message).toBe(message);
    expect(store.getters['calls/pending']).toEqual([identifier, secondIdentifier]);

    store.commit('calls/END', { identifier, message }, { root: true });
    expect(store.state.calls.calls[identifier].status).toBe(constants.DONE);
    expect(store.getters['calls/done']).toEqual([identifier, thirdIdentifier]);

    store.commit('calls/FAIL', { identifier, message }, { root: true });
    expect(store.state.calls.calls[identifier].status).toBe(constants.FAILED);
    expect(store.getters['calls/failed']).toEqual([identifier, fourthIdentifier]);
  });

  it('should add meta data', () => {
    const started = dayjs();
    const stopped = started.clone().add(200, 'ms');

    mockdate.set(started.toDate());

    store.commit('calls/START', { identifier, message }, { root: true });
    expect(store.state.calls.calls[identifier]).toEqual({
      _duration: null,
      _started: started,
      _stopped: null,
      message,
      status: constants.PENDING
    });

    mockdate.set(stopped.toDate());

    store.commit('calls/END', { identifier, message }, { root: true });
    expect(store.state.calls.calls[identifier]).toEqual({
      _duration: 200,
      _started: started,
      _stopped: stopped,
      message,
      status: constants.DONE
    });

    store.commit('calls/FAIL', { identifier, message }, { root: true });
    expect(store.state.calls.calls[identifier]).toEqual({
      _duration: 200,
      _started: started,
      _stopped: stopped,
      message,
      status: constants.FAILED
    });

    store.commit('calls/RESET', { root: true });

    store.commit('calls/FAIL', { identifier, message }, { root: true });
    expect(store.state.calls.calls[identifier]).toEqual({
      _duration: 0,
      _started: stopped,
      _stopped: stopped,
      message,
      status: constants.FAILED
    });
  });
});
