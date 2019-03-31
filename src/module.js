import Vue from 'vue';

import constants from './constants';

function updateRequest(state, { identifier, message }, status) {
  Vue.set(state.requests, identifier, { status, message });
}

export default {
  namespaced: true,

  mutations: {
    end(state, payload) {
      updateRequest(state, payload, constants.SUCCESS);
    },

    fail(state, payload) {
      updateRequest(state, payload, constants.FAILED);
    },

    start(state, payload) {
      updateRequest(state, payload, constants.PENDING);
    },
  },

  state: {
    requests: {},
  },
};
