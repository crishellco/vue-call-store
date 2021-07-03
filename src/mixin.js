import get from 'lodash.get';
import intersection from 'lodash.intersection';

export default {
  methods: {
    $endCall(identifier, message = null) {
      return this.$store.dispatch('calls/end', { identifier, message }, { root: true });
    },

    $failCall(identifier, message = null) {
      return this.$store.dispatch('calls/fail', { identifier, message }, { root: true });
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
      return this.$store.dispatch('calls/start', { identifier, message }, { root: true });
    }
  },

  beforeMount() {
    this.$calls = {
      end: (identifier, message = null) => {
        return this.$endCall(identifier, message);
      },

      fail: (identifier, message = null) => {
        return this.$failCall(identifier, message);
      },

      get: (identifier, defaultValue = null) => {
        return this.$getCall(identifier, defaultValue);
      },

      hasFailed: identifier => {
        return this.$callHasFailed(identifier);
      },

      isDone: identifier => {
        return this.$callIsDone(identifier);
      },

      isPending: identifier => {
        return this.$callIsPending(identifier);
      },

      start: (identifier, message = null) => {
        return this.$startCall(identifier, message);
      }
    };
  }
};
