import _ from 'lodash';

import constants from './constants';

export default {
  methods: {
    $endRequest(identifier, message = null) {
      this.$store.dispatch('requests/end', { identifier, message });
    },

    $failRequest(identifier, message = null) {
      this.$store.dispatch('requests/fail', { identifier, message });
    },

    $getRequest(identifier, defaultValue = null) {
      return _.get(this.$store.state.requests.requests, identifier, defaultValue);
    },

    $isDone(identifier) {
      return _.get(this.$store.state.requests.requests, [identifier, 'status']) === constants.SUCCESS;
    },

    $isFailed(identifier) {
      return _.get(this.$store.state.requests.requests, [identifier, 'status']) === constants.FAILED;
    },

    $isPending(identifier) {
      return _.get(this.$store.state.requests.requests, [identifier, 'status']) === constants.PENDING;
    },

    $startRequest(identifier, message = null) {
      this.$store.dispatch('requests/start', { identifier, message });
    },
  },
};
