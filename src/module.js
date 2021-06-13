import get from 'lodash.get';
import merge from 'lodash.merge';
import dayjs from 'dayjs';
import reduce from 'lodash.reduce';
import set from 'lodash.set';

import constants from './constants';

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
  const oldCall = get(state.calls, identifier, {});
  const newCall = set({}, identifier, addMeta(oldCall, { status, message }));
  const promise = new Promise((resolve) => {
    setTimeout(resolve, Math.max(0, 0 - newCall._duration));
  })
  await promise;
  
  return Object.assign({}, state.calls, newCall);
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

export default {
  namespaced: true,

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
    END(state, payload) {
      state.calls = updateCall(state, payload, constants.DONE);
    },

    FAIL(state, payload) {
      state.calls = updateCall(state, payload, constants.FAILED);
    },

    RESET(state) {
      state.calls = {};
    },

    START(state, payload) {
      state.calls = updateCall(state, payload, constants.PENDING);
    }
  },

  state: {
    calls: {}
  }
};
