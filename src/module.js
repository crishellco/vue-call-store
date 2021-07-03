import get from 'lodash.get';
import merge from 'lodash.merge';
import dayjs from 'dayjs';
import reduce from 'lodash.reduce';
import set from 'lodash.set';

import constants from './constants';

export default ({ minDuration }) => {
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

  async function updateCall(state, { identifier, message }, status) {
    return new Promise(resolve => {
      const oldCall = get(state.calls, identifier, {});
      const newCall = addMeta({ ...oldCall }, { status, message });

      if ([constants.DONE, constants.FAILED].includes(status)) {
        new Promise(resolve => {
          setTimeout(resolve, Math.max(0, minDuration - newCall._duration));
        }).then(() => {
          resolve(addMeta({ ...oldCall }, { status, message }));
        });
      } else {
        return resolve(newCall);
      }
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

      async start({ commit, state }, payload) {
        const call = await updateCall(state, payload, constants.PENDING);

        commit('UPDATE', { identifier: payload.identifier, call });
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
