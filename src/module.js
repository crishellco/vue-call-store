import _ from 'lodash';
import moment from 'moment';
import Vue from 'vue';

import constants from './constants';

function duration({ _started, _stopped }) {
  return _stopped ? moment.duration(_stopped.diff(_started)).as('ms') : null;
}

function addMeta(oldRequest, request) {
  const pending = request.status === constants.PENDING;

  request = _.merge(oldRequest, request, {
    _started: oldRequest._started || moment(),
    _stopped: !pending ? moment() : oldRequest._stopped || null,
  });

  return _.set(request, '_duration', duration(request));
}

function updateRequest(state, { identifier, message }, status) {
  const oldRequest = _.get(state.requests, identifier, {});

  Vue.set(state.requests, identifier, addMeta(oldRequest, { status, message }));
}

export default {
  namespaced: true,

  getters: {
    requests: state => state.requests,
  },

  mutations: {
    end(state, payload) {
      updateRequest(state, payload, constants.DONE);
    },

    fail(state, payload) {
      updateRequest(state, payload, constants.FAILED);
    },

    reset(state) {
      state.requests = {};
    },

    start(state, payload) {
      updateRequest(state, payload, constants.PENDING);
    },
  },

  state: {
    requests: {},
  },
};
