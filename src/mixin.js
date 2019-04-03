import _ from 'lodash';

import constants from './constants';

export default {
  methods: {
    $endRequest(identifier, message = null) {
      this.$store.commit('requests/end', { identifier, message }, { root: true });
    },

    $failRequest(identifier, message = null) {
      this.$store.commit('requests/fail', { identifier, message }, { root: true });
    },

    $getRequest(identifier, defaultValue = null) {
      return _.get(this.$store.state.requests.requests, [identifier], defaultValue);
    },

    $requestHasFailed(identifier) {
      return _.get(this.$store.state.requests.requests, [identifier, 'status']) === constants.FAILED;
    },

    $requestIsDone(identifier) {
      return _.get(this.$store.state.requests.requests, [identifier, 'status']) === constants.DONE;
    },

    $requestIsPending(identifier) {
      return _.get(this.$store.state.requests.requests, [identifier, 'status']) === constants.PENDING;
    },

    $startRequest(identifier, message = null) {
      this.$store.commit('requests/start', { identifier, message }, { root: true });
    },
  },
};
