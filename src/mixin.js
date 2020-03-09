import get from 'lodash.get';
import intersection from 'lodash.intersection';

export default {
  methods: {
    $endCall(identifier, message = null) {
      this.$store.commit('calls/END', { identifier, message }, { root: true });
    },

    $failCall(identifier, message = null) {
      this.$store.commit('calls/FAIL', { identifier, message }, { root: true });
    },

    $getCall(identifier, defaultValue = null) {
      return this.$call(identifier, defaultValue);
    },

    $call(identifier, defaultValue = null) {
      return get(this.$store.state.calls.calls, [identifier], defaultValue);
    },

    $callHasFailed(identifier) {
      return !!intersection(this.$store.getters['calls/failed'], [].concat(identifier)).length;
    },

    $callIsDone(identifier) {
      const identifiers = [].concat(identifier);

      return (
        intersection(this.$store.getters['calls/done'], identifiers).length == identifiers.length
      );
    },

    $callIsPending(identifier) {
      return !!intersection(this.$store.getters['calls/pending'], [].concat(identifier)).length;
    },

    $startCall(identifier, message = null) {
      this.$store.commit('calls/START', { identifier, message }, { root: true });
    }
  },

  beforeMount() {
    this.$calls = {
      end: (identifier, message = null) => {
        this.$store.commit('calls/END', { identifier, message }, { root: true });
      },

      fail: (identifier, message = null) => {
        this.$store.commit('calls/FAIL', { identifier, message }, { root: true });
      },

      get: (identifier, defaultValue = null) => {
        return get(this.$store.state.calls.calls, [identifier], defaultValue);
      },

      hasFailed: identifier => {
        return !!intersection(this.$store.getters['calls/failed'], [].concat(identifier)).length;
      },

      isDone: identifier => {
        const identifiers = [].concat(identifier);

        return (
          intersection(this.$store.getters['calls/done'], identifiers).length == identifiers.length
        );
      },

      isPending: identifier => {
        return !!intersection(this.$store.getters['calls/pending'], [].concat(identifier)).length;
      },

      start: (identifier, message = null) => {
        this.$store.commit('calls/START', { identifier, message }, { root: true });
      }
    };
  }
};
