import get from 'lodash.get';
import merge from 'lodash.merge';
import moment from 'moment';
import reduce from 'lodash.reduce';
import set from 'lodash.set';

import constants from './constants';

function addMeta(oldRequest, request) {
  const pending = request.status === constants.PENDING;

  request = merge(oldRequest, request, {
    _started: oldRequest._started || moment(),
    _stopped: !pending ? moment() : oldRequest._stopped || null
  });

  return set(request, '_duration', duration(request));
}

function duration({ _started, _stopped }) {
  return _stopped ? moment.duration(_stopped.diff(_started)).as('ms') : null;
}

function updateRequest(state, { identifier, message }, status) {
  const oldRequest = get(state.requests, identifier, {});
  const newRequest = set({}, identifier, addMeta(oldRequest, { status, message }));

  return Object.assign({}, state.requests, newRequest);
}

export default {
  namespaced: true,

  getters: {
    done(state) {
      return reduce(
        state.requests,
        (result, request, identifier) => {
          if (request.status === constants.DONE) {
            result.push(identifier);
          }

          return result;
        },
        []
      );
    },

    failed(state) {
      return reduce(
        state.requests,
        (result, request, identifier) => {
          if (request.status === constants.FAILED) {
            result.push(identifier);
          }

          return result;
        },
        []
      );
    },

    pending(state) {
      return reduce(
        state.requests,
        (result, request, identifier) => {
          if (request.status === constants.PENDING) {
            result.push(identifier);
          }

          return result;
        },
        []
      );
    },

    requests: state => state.requests
  },

  mutations: {
    end(state, payload) {
      state.requests = updateRequest(state, payload, constants.DONE);
    },

    fail(state, payload) {
      state.requests = updateRequest(state, payload, constants.FAILED);
    },

    reset(state) {
      state.requests = {};
    },

    start(state, payload) {
      state.requests = updateRequest(state, payload, constants.PENDING);
    }
  },

  state: {
    requests: {}
  }
};
