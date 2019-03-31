import _ from 'lodash';

import constants from './constants';

export default {
  beforeMount() {
    const _this = this;

    this.$r = this.$requests = {
      end(identifier, message = null) {
        _this.$store.commit('requests/end', { identifier, message });
      },

      fail(identifier, message = null) {
        _this.$store.commit('requests/fail', { identifier, message });
      },

      get(identifier, defaultValue = null) {
        return _.get(_this.$store.state.requests.requests, [identifier], defaultValue);
      },

      isDone(identifier) {
        return _.get(_this.$store.state.requests.requests, [identifier, 'status']) === constants.SUCCESS;
      },

      isFailed(identifier) {
        return _.get(_this.$store.state.requests.requests, [identifier, 'status']) === constants.FAILED;
      },

      isPending(identifier) {
        return _.get(_this.$store.state.requests.requests, [identifier, 'status']) === constants.PENDING;
      },

      start(identifier, message = null) {
        _this.$store.commit('requests/start', { identifier, message });
      }
    }
  },
};
