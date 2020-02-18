import get from 'lodash.get';
import intersection from 'lodash.intersection';

export default {
  methods: {
    $endRequest(identifier, message = null) {
      this.$store.commit('requests/end', { identifier, message }, { root: true });
    },

    $failRequest(identifier, message = null) {
      this.$store.commit('requests/fail', { identifier, message }, { root: true });
    },

    $getRequest(identifier, defaultValue = null) {
      return this.$request(identifier, defaultValue);
    },

    $request(identifier, defaultValue = null) {
      return get(this.$store.state.requests.requests, [identifier], defaultValue);
    },

    $requestHasFailed(identifier) {
      return !!intersection(this.$store.getters['requests/failed'], [].concat(identifier)).length;
    },

    $requestIsDone(identifier) {
      const identifiers = [].concat(identifier);

      return (
        intersection(this.$store.getters['requests/done'], identifiers).length == identifiers.length
      );
    },

    $requestIsPending(identifier) {
      return !!intersection(this.$store.getters['requests/pending'], [].concat(identifier)).length;
    },

    $startRequest(identifier, message = null) {
      this.$store.commit('requests/start', { identifier, message }, { root: true });
    }
  },

  beforeMount() {
    this.$requests = {
      end: (identifier, message = null) => {
        this.$store.commit('requests/end', { identifier, message }, { root: true });
      },

      fail: (identifier, message = null) => {
        this.$store.commit('requests/fail', { identifier, message }, { root: true });
      },

      get: (identifier, defaultValue = null) => {
        return get(this.$store.state.requests.requests, [identifier], defaultValue);
      },

      hasFailed: identifier => {
        return !!intersection(this.$store.getters['requests/failed'], [].concat(identifier)).length;
      },

      isDone: identifier => {
        const identifiers = [].concat(identifier);

        return (
          intersection(this.$store.getters['requests/done'], identifiers).length ==
          identifiers.length
        );
      },

      isPending: identifier => {
        return !!intersection(this.$store.getters['requests/pending'], [].concat(identifier))
          .length;
      },

      start: (identifier, message = null) => {
        this.$store.commit('requests/start', { identifier, message }, { root: true });
      }
    };
  }
};
