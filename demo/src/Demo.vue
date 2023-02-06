<template>
  <div class="flex h-full overflow-hidden">
    <div class="flex-1 flex flex-col items-center justify-center space-y-4">
      <div v-for="(call, index) in calls" :key="index" class="relative">
        <button
          :class="[
            call.action,
            {
              'bg-blue-500 text-white': !$store.state.calls.calls[call.identifier],
              'bg-gray-300 cursor-not-allowed text-gray-900': $calls.isPending(call.identifier),
              'bg-red-500 cursor-not-allowed text-white': $calls.hasFailed(call.identifier),
              'bg-green-500 cursor-not-allowed text-white': $calls.isDone(call.identifier),
            },
          ]"
          class="px-4 py-3 rounded w-64 text-sm relative overflow-hidden drop-shadow-md"
          :disabled="$calls.isPending(call.identifier)"
          @click="go(call)"
        >
          <div class="z-10 relative">
            {{ `${call.identifier} [${call.action} in ${(call.remaining / 1000).toFixed(1)}s]` }}
          </div>
          <div
            v-if="$calls.isPending(call.identifier)"
            class="absolute top-0 left-0 h-full bg-gray-400 transition duration-100 transition-all"
            :style="{ width: `${(call.remaining / call.duration) * 100}%` }"
          ></div>
        </button>
        <div />
      </div>
      <div class="flex flex-none justify-between w-64 h-6">
        <template v-if="!anyPending">
          <a href="" class="flex-none text-xs text-blue-600 hover:underline" @click.prevent="reset"
            >Reset</a
          >
          <a
            v-if="noneHaveRun"
            href=""
            class="flex-none text-xs text-blue-600 hover:underline"
            @click.prevent="runAll"
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
import generate from 'project-name-generator';

import constants from '../../src/constants';

const INTERVAL = 100;

function randomCall() {
  const action = ['end', 'fail'][random()];
  const delay = Math.ceil(random(500, 5000) / INTERVAL) * INTERVAL;

  return {
    action,
    delay,
    identifier: generate({ alliterative: true }).dashed,
    remaining: delay,
    duration: delay,
  };
}

export default {
  filters: {
    pretty: function (value) {
      return JSON.stringify(value, null, 2);
    },
  },

  data() {
    return { calls: [] };
  },

  computed: {
    anyPending() {
      return !!Object.values(this.$store.state.calls.calls).filter(
        ({ status }) => status === constants.PENDING
      ).length;
    },

    noneHaveRun() {
      return (
        this.$store.getters['calls/done'].length + this.$store.getters['calls/failed'].length === 0
      );
    },
  },

  beforeMount() {
    this.reset();
  },

  methods: {
    go(call) {
      if (!call.remaining) return;

      this.$calls.trackRequest(call, this.getPromise(call));
    },

    getPromise(call) {
      const { action, delay } = call;
      const index = this.calls.findIndex((c) => c === call);

      return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
          this.calls[index].remaining -= INTERVAL;
        }, INTERVAL);

        setTimeout(() => {
          clearTimeout(interval);
          action === 'end' ? resolve() : reject();
        }, delay);
      });
    },

    reset() {
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
