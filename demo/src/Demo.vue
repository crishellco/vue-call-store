<template>
  <div class="flex h-full overflow-hidden">
    <div class="flex-1 flex flex-col items-center justify-center">
      <div
        v-for="(call, index) in calls"
        :key="index"
        class="mb-4 relative"
      >
        <button
          :class="[
            call.action,
            {
              'bg-blue-500': !$store.state.calls.calls[call.identifier],
              'bg-gray-500 opacity-50 cursor-not-allowed': $calls.isPending(call.identifier),
              'bg-red-500': $calls.hasFailed(call.identifier),
              'bg-green-500': $calls.isDone(call.identifier),
            },
          ]"
          class="px-4 py-3 rounded w-48 text-white text-sm"
          :disabled="$calls.isPending(call.identifier)"
          @click="go(call)"
        >
          {{ `${call.identifier} [${call.action} in ${(call.remaining / 1000).toFixed(1)}s]` }}
        </button>
        <div />
      </div>
      <div class="flex flex-none justify-between w-48 h-6">
        <template v-if="!anyPending">
          <a
            href=""
            class="flex-none text-xs text-blue-600 hover:underline"
            @click.prevent="refresh"
          >Refresh</a>
          <a
            href=""
            class="flex-none text-xs text-blue-600 hover:underline"
            @click.prevent="runAll"
          >Run All</a>
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

const INTERVAL = 100;

function randomCall() {
  const action = ['end', 'fail'][random()];
  const delay = Math.ceil(random(500, 5000) / INTERVAL) * INTERVAL;

  return {
    action,
    delay,
    identifier: uniqueId('call'),
    remaining: delay,
  };
}

export default {
  filters: {
    pretty: function (value) {
      return JSON.stringify(value, null, 2);
    },
  },

  data() {
    return {
      calls: [],
    };
  },

  computed: {
    anyPending() {
      return !!Object.values(this.$store.state.calls.calls).filter(
        ({ status }) => status === constants.PENDING
      ).length;
    },
  },

  beforeMount() {
    this.refresh();
  },

  methods: {
    go(call) {
      const { action, delay, identifier } = call;
      const index = this.calls.findIndex((c) => c === call);

      this.$calls.start(identifier, `this.$calls.start('${identifier}')`);

      const interval = setInterval(() => {

        
        this.calls[index].remaining -= INTERVAL;
      }, INTERVAL);

      setTimeout(() => {
        clearTimeout(interval);
        this.$calls[action](identifier, `this.$calls.${action}('${identifier}')`);
      }, delay);
    },

    refresh() {
      this.$store.commit('calls/RESET');
      this.$set(this, 'calls', times(5, randomCall));
    },

    runAll() {
      this.calls.map(this.go);
    },
  },
};
</script>

<style scoped></style>
