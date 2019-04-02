import _ from 'lodash';
import moment from 'moment';
import Vue from 'vue';

import constants from './constants';

const defaultOptions = { minDuration: 0 };
let options;

function addMeta(oldRequest, request) {
  const pending = request.status === constants.PENDING;

  request = _.merge(oldRequest, request, {
    _started: oldRequest._started || moment(),
    _stopped: !pending ? moment() : null,
  });

  return _.set(request, '_duration', calculateDuration(request));
}

function calculateDuration({ _started, _stopped }) {
  return _stopped ? moment.duration(_stopped.diff(_started)).as('ms') : null;
}

function calculateTimeout({ _duration, status }) {
  if (status === constants.PENDING) return 0;

  const diff = options.minDuration - _duration;

  return diff > 0 ? diff : 0;
}

function updateRequest(state, { identifier, message }, status) {
  const oldRequest = _.get(state.requests, identifier, {});
  const request = addMeta(oldRequest, { status, message });
  const timeout = calculateTimeout(request);

  Vue.set(state.requests, identifier, request);
}

export default (opts = {}) => {
  options = _.defaults(opts, defaultOptions);

  return {
    namespaced: true,

    mutations: {
      end(state, payload) {
        updateRequest(state, payload, constants.SUCCESS);
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
};
