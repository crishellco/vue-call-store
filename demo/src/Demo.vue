<template>
  <div class="flex h-full overflow-hidden">
    <div class="flex-1 flex flex-col items-center justify-center">
      <div v-for="(call, index) in calls" :key="index" class="mb-4">
        <button
          @click="go(call)"
          :class="[
            call.action,
            {
              'bg-blue-500': !$store.state.calls.calls[call.identifier],
              'bg-gray-500 opacity-50 cursor-not-allowed': $calls.isPending(call.identifier),
              'bg-red-500': $calls.hasFailed(call.identifier),
              'bg-green-500': $calls.isDone(call.identifier)
            }
          ]"
          class="px-4 py-3 rounded w-48 text-white text-sm"
          :disabled="$calls.isPending(call.identifier)"
        >
          {{ `${call.identifier} [${call.action} in ${(call.delay / 1000).toFixed(1)}s]` }}
        </button>
      </div>
      <div class="flex flex-none justify-between w-48 h-6">
        <template v-if="!anyPending">
          <a
            @click.prevent="refresh"
            href=""
            class="flex-none text-xs text-blue-600 hover:underline"
            >Refresh</a
          >
          <a @click.prevent="runAll" href="" class="flex-none text-xs text-blue-600 hover:underline"
            >Run All</a
          >
        </template>
      </div>
    </div>
    <div class="flex-none w-1/2 flex flex-col">
      <pre class="whitespace-pre flex-1 flex flex-col">
        <code class="block rounded p-2 text-sm font-mono bg-gray-700 text-white flex flex-1">// vm.$store.state.calls.calls
{{ $store.state.calls.calls | pretty }}
        </code>
      </pre>
    </div>
  </div>
</template>

<script>
import { random, times, uniqueId } from 'lodash';
import constants from '../../src/constants';

function randomCall() {
  const action = ['end', 'fail'][random()];

  return {
    action,
    delay: random(500, 5000),
    identifier: uniqueId('call')
  };
}

export default {
  data() {
    return {
      calls: []
    };
  },

  computed: {
    anyPending() {
      return !!Object.values(this.$store.state.calls.calls).filter(
        ({ status }) => status === constants.PENDING
      ).length;
    }
  },

  filters: {
    pretty: function(value) {
      return JSON.stringify(value, null, 2);
    }
  },

  beforeMount() {
    this.refresh();
  },

  methods: {
    go({ action, delay, identifier }) {
      this.$calls.start(identifier, `this.$calls.start('${identifier}')`);

      setTimeout(() => {
        this.$calls[action](identifier, `this.$calls.${action}('${identifier}')`);
      }, delay);
    },

    refresh() {
      this.$store.commit('calls/RESET');
      this.$set(this, 'calls', times(5, randomCall));
    },

    runAll() {
      this.calls.map(this.go);
    }
  }
};
</script>

<style scoped></style>
