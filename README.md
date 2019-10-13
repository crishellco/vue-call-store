# Vue Request Store
[![Codeship Status for crishellco/vue-request-store](https://app.codeship.com/projects/6fc2e700-35f9-0137-5a4a-56926ea83142/status?branch=master)](https://app.codeship.com/projects/332904)
![](badges/badge-branches.svg)
![](badges/badge-functionss.svg)
![](badges/badge-lines.svg)
![](badges/badge-statements.svg)



A Vue & Vuex plugin to simplify tracking API request statuses.

Vue Request Store provides a Vuex module and component methods to make it easy to update API request statuses and keep track of them.

_This plugin requires that your project use Vuex_

## Install

```bash
yarn add -D vue-request-store
yarn add -D vuex
# or
npm i -D vue-request-store
npm i -D vuex
```

```javascript
import Vuex from 'vuex';
import VueRequestStore from 'vue-request-store';

Vue.use(Vuex);

const store = new Vuex.Store({});

Vue.use(VueRequestStore, { store });
```

## Usage

#### Update the status of a request
```javascript
/**
 * @arg {string} identifier
 * @arg {*} [message]
 */
vm.$startRequest('fetchUsers');
vm.$endRequest('fetchUsers');
vm.$failRequest('fetchUsers', error);

// Example usage in a Vuex action
new Vuex.Store({
  actions: {
    fetchUsers({ commit }) {
      this._vm.$startRequest('fetchUsers');

      axios
        .get('/api/users')
        .then(({data} => {
          commit('users/set', data);
          this._vm.$endRequest('fetchUsers');
        })
        .catch(({response}) => {
          this._vm.$failRequest('fetchUsers', response.data.errors);
        });
    },
  },
});

```

#### Check the status of a request
```javascript
/**
 * @arg {string} identifier
 * @returns {boolean}
 */
const isPending = vm.$requestIsPending('fetchUsers');
const isDone = vm.$requestIsDone('fetchUsers');
const hasFailed = vm.$requestHasFailed('fetchUsers');

// Example usage in a template
<template>
  <loading-indicator v-if="$requestIsPending('fetchUsers')" />
  <div v-else class="content">
    ...
  </div>
</template>

```

#### Get the raw request object
```javascript
/**
 * @arg {string} identifier
 * @arg {*} [defaultValue = null]
 * @returns {object|null}
 */
const request = vm.$getRequest('fetchUsers');

// Format
{
  _duration: 200, // milliseconds
  _started: moment('2019-04-02T15:19:05.000'), // or null
  _stopped: moment('2019-04-02T15:19:05.200'), // or null
  message: 'message',
  status: 'success',
}
```

#### Available mutations
```javascript
vm.$store.commit('requests/start', { identifier, message });
vm.$store.commit('requests/end', { identifier, message });
vm.$store.commit('requests/fail', { identifier, message });
vm.$store.commit('requests/reset'); // Removes all request objects
```

## Lint
```bash
yarn lint
```

## Test
```bash
yarn test
```

## Build
```bash
yarn build
```

## How to Contribute

### Pull Requests

1. Fork the repository
2. Create a new branch for each feature or improvement
3. Send a pull request from each feature branch to the **develop** branch

## License

[MIT](http://opensource.org/licenses/MIT)
