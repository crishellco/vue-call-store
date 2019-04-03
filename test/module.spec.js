import { createLocalVue } from '@vue/test-utils';
import moment from 'moment';
import Vuex from 'vuex';

import constants from '../src/constants';
import VueRequestStore from '../src';

const identifier = 'identifier';
const message = 'message';
let localVue;
let store;

describe('module.js', () => {
  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
    store = new Vuex.Store();
  });

  describe('with min duration', () => {
    beforeEach(() => {
      localVue.use(VueRequestStore, { options: { minDuration: 500 }, store });
      store.commit('requests/reset', { root: true });
    });

    it('should delay ending a request', (done) => {
      store.dispatch('requests/start', { identifier, message }, { root: true });
      expect(store.state.requests.requests[identifier].status).toBe(constants.PENDING);

      store.dispatch('requests/end', { identifier, message }, { root: true });
      expect(store.state.requests.requests[identifier].status).toBe(constants.PENDING);

      setTimeout(() => {
        expect(store.state.requests.requests[identifier].status).toBe(constants.SUCCESS);
        done();
      }, 1000);
    });

    it('should delay failing a request', (done) => {
      store.dispatch('requests/start', { identifier, message }, { root: true });
      expect(store.state.requests.requests[identifier].status).toBe(constants.PENDING);

      store.dispatch('requests/fail', { identifier, message }, { root: true });
      expect(store.state.requests.requests[identifier].status).toBe(constants.PENDING);

      setTimeout(() => {
        expect(store.state.requests.requests[identifier].status).toBe(constants.FAILED);
        done();
      }, 1000);
    });
  });

  describe('without min duration', () => {
    beforeEach(() => {
      localVue.use(VueRequestStore, { store });
      store.commit('requests/reset', { root: true });
    });

    it('should start, end, and fail requests', () => {
      store.dispatch('requests/start', { identifier, message }, { root: true });
      expect(store.state.requests.requests[identifier].status).toBe(constants.PENDING);
      expect(store.state.requests.requests[identifier].message).toBe(message);

      store.dispatch('requests/end', { identifier, message }, { root: true });
      expect(store.state.requests.requests[identifier].status).toBe(constants.SUCCESS);

      store.dispatch('requests/fail', { identifier, message }, { root: true });
      expect(store.state.requests.requests[identifier].status).toBe(constants.FAILED);
    });

    it('should add meta data', () => {
      const started = moment(); const
        stopped = started.clone();
      stopped.add(200, 'ms');

      Date.now = jest.fn()
        .mockReturnValueOnce(started)
        .mockReturnValue(stopped);

      store.dispatch('requests/start', { identifier, message }, { root: true });
      expect(store.state.requests.requests[identifier]).toEqual({
        _duration: null,
        _started: started,
        _stopped: null,
        identifier,
        message,
        status: constants.PENDING,
      });

      store.dispatch('requests/end', { identifier, message }, { root: true });
      expect(store.state.requests.requests[identifier]).toEqual({
        _duration: 200,
        _started: started,
        _stopped: stopped,
        identifier,
        message,
        status: constants.SUCCESS,
      });

      store.dispatch('requests/fail', { identifier, message }, { root: true });
      expect(store.state.requests.requests[identifier]).toEqual({
        _duration: 200,
        _started: started,
        _stopped: stopped,
        identifier,
        message,
        status: constants.FAILED,
      });

      store.commit('requests/reset', { root: true });

      store.dispatch('requests/fail', { identifier, message }, { root: true });
      expect(store.state.requests.requests[identifier]).toEqual({
        _duration: 0,
        _started: stopped,
        _stopped: stopped,
        identifier,
        message,
        status: constants.FAILED,
      });

      store.dispatch('requests/start', { identifier, message }, { root: true });
      expect(store.state.requests.requests[identifier]).toEqual({
        _duration: null,
        _started: stopped,
        _stopped: null,
        identifier,
        message,
        status: constants.PENDING,
      });
    });
  });
});
