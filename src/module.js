import _ from 'lodash';
import moment from 'moment';
import Vue from 'vue';

import constants from './constants';

const defaultOptions = { minDuration: 0 };
const timeouts = {};
let options;

function addMeta(oldRequest, request) {
  const pending = request.status === constants.PENDING;

  request = _.merge(oldRequest, request, {
    _started: oldRequest._started || moment(),
    _stopped: !pending ? moment() : null,
  });

  return _.set(request, '_duration', calculateDuration(request));
}

function buildRequest(state, { identifier, message }, status) {
  const oldRequest = Object.assign({}, _.get(state.requests, identifier, {}));

  return addMeta(oldRequest, { identifier, status, message });
}

function calculateDuration({ _started, _stopped }) {
  return _stopped ? moment.duration(_stopped.diff(_started)).as('ms') : null;
}

function calculateTimeout({ _duration, status }) {
  if (status === constants.PENDING) return 0;

  const diff = options.minDuration - _duration;

  return diff > 0 ? diff : 0;
}

export default (opts = {}) => {
  options = _.defaults(opts, defaultOptions);

  return {
    namespaced: true,

    actions: {
      end({ dispatch, state }, payload) {
        const request = buildRequest(state, payload, constants.SUCCESS);

        dispatch('requests/update', request, { root: true });
      },

      fail({ dispatch, state }, payload) {
        const request = buildRequest(state, payload, constants.FAILED);

        dispatch('requests/update', request, { root: true });
      },

      start({ dispatch, state }, payload) {
        const request = buildRequest(state, payload, constants.PENDING);

        dispatch('requests/update', request, { root: true });
      },

      update({ commit }, request) {
        const { identifier } = request;
        const timeout = calculateTimeout(request);
        clearTimeout(timeouts[identifier]);

        if (!timeout) {
          commit('requests/update', request, { root: true });
        } else {
          timeouts[identifier] = setTimeout(() => {
            commit('requests/update', request, { root: true });
          }, timeout);
        }
      },
    },

    mutations: {
      reset(state) {
        state.requests = {};
      },

      update(state, request) {
        Vue.set(state.requests, request.identifier, request);
      },
    },

    state: {
      requests: {},
    },
  };
};
