import get from 'lodash.get';

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
      return get(this.$store.state.requests.requests, [identifier], defaultValue);
    },

    $requestHasFailed(identifier) {
      return get(this.$store.state.requests.requests, [identifier, 'status']) === constants.FAILED;
    },

    $requestIsDone(identifier) {
      return get(this.$store.state.requests.requests, [identifier, 'status']) === constants.DONE;
    },

    $requestIsPending(identifier) {
      return get(this.$store.state.requests.requests, [identifier, 'status']) === constants.PENDING;
    },

    $startRequest(identifier, message = null) {
      this.$store.commit('requests/start', { identifier, message }, { root: true });
    }
  }
};
