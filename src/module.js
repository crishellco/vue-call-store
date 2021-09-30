import dayjs from 'dayjs';
import { get, merge, reduce, set } from 'lodash';

import constants from './constants';

export default ({ disablePromises, minDuration }) => {
  function addMeta(oldCall, call) {
    const pending = call.status === constants.PENDING;

    call = merge(oldCall, call, {
      _started: oldCall._started || dayjs(),
      _stopped: pending ? null : oldCall._stopped || dayjs()
    });

    return set(call, '_duration', duration(call));
  }

  function duration({ _started, _stopped }) {
    return _stopped ? _stopped.diff(_started) : null;
  }

  async function updateCall(
    state,
    { identifier, message, minDuration: overrideMinDuration },
    status
  ) {
    const { oldCall, newCall } = getUpdatedCall(state, { identifier, message }, status);

    if (disablePromises) return newCall;

    return new Promise(resolve => {
      new Promise(resolve => {
        setTimeout(
          resolve,
          Math.max(0, parseInt(overrideMinDuration ?? minDuration) - newCall._duration)
        );
      }).then(() => {
        resolve(addMeta({ ...oldCall }, { status, message }));
      });
    });
  }

  function getByStatus(state, status) {
    return reduce(
      state.calls,
      (result, call, identifier) => {
        if (call.status === status) {
          result.push(identifier);
        }

        return result;
      },
      []
    );
  }

  function getUpdatedCall(state, { identifier, message }, status) {
    const oldCall = get(state.calls, identifier, {});
    const newCall = addMeta({ ...oldCall }, { status, message });

    return { oldCall, newCall };
  }

  return {
    namespaced: true,

    actions: {
      async end({ commit, state }, payload) {
        const call = await updateCall(state, payload, constants.DONE);

        commit('UPDATE', { identifier: payload.identifier, call });
      },

      async fail({ commit, state }, payload) {
        const call = await updateCall(state, payload, constants.FAILED);

        commit('UPDATE', { identifier: payload.identifier, call });
      },

      start({ commit, state }, payload) {
        const { identifier } = payload;
        const { newCall } = getUpdatedCall(state, payload, constants.PENDING);

        commit('UPDATE', { identifier, call: newCall });
      }
    },

    getters: {
      done(state) {
        return getByStatus(state, constants.DONE);
      },

      failed(state) {
        return getByStatus(state, constants.FAILED);
      },

      pending(state) {
        return getByStatus(state, constants.PENDING);
      },

      calls: state => state.calls
    },

    mutations: {
      RESET(state) {
        state.calls = {};
      },

      UPDATE(state, { identifier, call }) {
        state.calls = Object.assign({}, state.calls, set({}, identifier, call));
      }
    },

    state: { calls: {} }
  };
};
