![Build](https://github.com/crishellco/vue-call-store/workflows/Build/badge.svg)
[![codecov](https://codecov.io/gh/crishellco/vue-call-store/branch/master/graph/badge.svg?token=0BCLYvSqRd)](https://codecov.io/gh/crishellco/vue-call-store)
[![Maintainability](https://api.codeclimate.com/v1/badges/ad1b10ad23c04fab766b/maintainability)](https://codeclimate.com/github/crishellco/vue-call-store/maintainability)

# Vue Call Store

A Vue & Vuex plugin to simplify tracking API call statuses.

Vue Call Store provides a Vuex module and component methods to make it easy to update API call statuses and keep track of them.

Check out the [demo](https://vue-call-store.netlify.com/)

# Table of contents

- [Install](#install)
  - [Install Options](#install-options)
- [Examples](#examples)
  - [Update the status of a call](#update-the-status-of-a-call)
  - [Check the status of a call in a component](#check-the-status-of-a-call-in-a-component)
  - [Conditionally render with directives](#conditionally-render-with-directives)
  - [Conditionally render with components](#conditionally-render-with-components)
  - [Multiple identifer logic](#multiple-identifer-logic)
  - [Get the raw call object](#get-the-raw-call-object)
  - [Available actions & mutations](#available-actions--mutations)
- [Api](#api)
  - [vm.\$calls.end(identifier, message)](#vmcallsendidentifier-message)
  - [vm.\$endCall(identifier, message)](#vmendcallidentifier-message)
  - [vm.\$calls.fail(identifier, message)](#vmcallsfailidentifier-message)
  - [vm.\$failCall(identifier, message)](#vmfailcallidentifier-message)
  - [vm.\$calls.start(identifier, message)](#vmcallsstartidentifier-message)
  - [vm.\$startCall(identifier, message)](#vmstartcallidentifier-message)
  - [vm.\$getCall(identifier, defaultValue)](#vmgetcallidentifier-defaultvalue)
  - [vm.\$calls.get(identifier, defaultValue)](#vmcallsgetidentifier-defaultvalue)
  - [vm.\$calls.hasFailed(identifier)](#vmcallshasfailedidentifier)
  - [vm.\$callHasFailed(identifier)](#vmcallhasfailedidentifier)
  - [vm.\$calls.isDone(identifier)](#vmcallsisdoneidentifier)
  - [vm.\$callIsDone(identifier)](#vmcallisdoneidentifier)
  - [vm.\$calls.isPending(identifier)](#vmcallsispendingidentifier)
  - [vm.\$callIsPending(identifier)](#vmcallispendingidentifier)
- [Development](#development)
  - [Lint](#lint)
  - [Test](#test)
  - [Build](#build)
- [How to contribute](#how-to-contribute)
  - [Pull calls](#pull-calls)
- [License](#license)
## Install

```bash
yarn add -D @crishellco/vue-call-store
yarn add -D vuex
# or
npm i -D @crishellco/vue-call-store
npm i -D vuex
```

```javascript
import Vuex from 'vuex';
import VueCallStore from '@crishellco/vue-call-store';

/**
 * If Vuex isn't installed,
 * it will be installed.
 */
Vue.use(Vuex);

const store = new Vuex.Store({});

Vue.use(VueCallStore, { store, minDuration: 2000 });
```

### Install Options

| Name              | Type      | Default              | Description                                                                    |
|-------------------|-----------|----------------------|--------------------------------------------------------------------------------|
| `disablePromises` | `Boolean` | `false`              | Disables promises when updating a call. Useful for tests.                      |
| `minDuration`     | `Number`  | `0`                  | The minimum time in milliseconds that all requests must take before finishing. |
| `store`           | `Vuex`    | `new Vuex.Store({})` | A Vuex store to store request data.                                            |

## Examples

### Update the status of a call

```javascript
/**
 * @arg {string} identifier
 * @arg {*} [message]
 */
vm.$calls.start('fetchUsers');
vm.$calls.end('fetchUsers');
vm.$calls.fail('fetchUsers', error);

// Example usage in a Vuex action
new Vuex.Store({
  actions: {
    fetchUsers({ commit, dispatch }) {
      const identifier = 'fetchUsers';

      dispatch('calls/start', { identifier });

      axios
        .get('/api/users')
        .then(({data} => {
          commit('users/set', data);
          dispatch('calls/end', { identifier });
        })
        .catch(({response}) => {
          dispatch('calls/fail', { identifier, message: response.data.errors });
        });
    },
  },
});

```

### Check the status of a call in a component

```javascript
/**
 * @arg {string | array} identifier
 * @returns {boolean}
 */

const isPending = vm.$calls.isPending('fetchUsers');
const isDone = vm.$calls.isDone('fetchUsers');
const hasFailed = vm.$calls.hasFailed(['fetchUsers', 'second']);
```

### Conditionally render with directives

Directives accept string or array of identifiers.

```vue
<template>
  <loading-indicator v-call:pending="'fetchUsers'" />

  <div v-call:done="'fetchUsers'" class="content">
    <ul>
      <li v-for="user in users" :key="user.id">{{ user.name }}</li>
    </ul>
  </div>

  <div v-call:failed="['fetchUsers', 'second']" class="content">
    Oops! Unable to fetch users.
  </div>
```

### Conditionally render with components

Components' `identifier` props accept string or array of identifiers.

Components' `once` props accept a boolean. When `true`, the slot contents will only be hidden once.

```vue
  <v-call-pending identifier="fetchUsers" :once="true">
    <loading-indicator />
  </v-call-pending>

  <v-call-failed identifier="fetchUsers">
    <div class="content">
      <ul>
        <li v-for="user in users" :key="user.id">{{ user.name }}</li>
      </ul>
    </div>
  </v-call-failed>

  <v-call-failed :identifier="['fetchUsers', 'second']">
    <div class="content">
      Oops! Unable to fetch users.
    </div>
  </v-call-failed>
</template>
```

### Multiple identifer logic

| State   | Method                              | to be `true`                    |
|---------|-------------------------------------|---------------------------------|
| pending | `$callIsPending | $calls.isPending` | at least one of many is pending |
| done    | `$callIsDone | $calls.isDone`       | all are done                    |
| failed  | `$callHasFailed | $calls.hasFailed` | has least one has failed        |

_[See Source](src/mixin.js)_

### Get the raw call object

```javascript
/**
 * @arg {string} identifier
 * @arg {*} [defaultValue = null]
 * @returns {object|null}
 */
const notFoundValue = { status: 'done' };
const call = vm.$calls.get('fetchUsers', notFoundValue);

// Format
{
  _duration: 200, // milliseconds
  _started: moment('2019-04-02T15:19:05.000'), // or null
  _stopped: moment('2019-04-02T15:19:05.200'), // or null
  message: 'message',
  status: 'done',
}
```

### Available actions & mutations

```javascript
dispatch('calls/start', { identifier, message });
dispatch('calls/end', { identifier, message, minDuration });
dispatch('calls/fail', { identifier, message, minDuration });
commit('calls/RESET'); // Removes all call objects
```

## Api

### vm.\$calls.end(identifier, message)

### vm.\$endCall(identifier, message)

Ends a call.

- Arguments
  - `{string} identifier`
  - `{*} message` optional
- Returns `{void}`

### vm.\$calls.fail(identifier, message)

### vm.\$failCall(identifier, message)

Fails a call.

- Arguments
  - `{string} identifier`
  - `{*} message` optional
- Returns `{void}`

### vm.\$calls.start(identifier, message)

### vm.\$startCall(identifier, message)

Starts a call.

- Arguments
  - `{string} identifier`
  - `{*} message` optional
- Returns `{void}`

### vm.\$getCall(identifier, defaultValue)

### vm.\$calls.get(identifier, defaultValue)

Gets raw call.

- Arguments
  - `{string} identifier`
  - `{*} defaultValue (default: null)` optional
- Returns `{object}`

### vm.\$calls.hasFailed(identifier)

### vm.\$callHasFailed(identifier)

Gets if one or at least one of many calls has failed.

- Arguments
  - `{string | array} identifier`
- Returns `{boolean}`

### vm.\$calls.isDone(identifier)

### vm.\$callIsDone(identifier)

Gets if one or all calls are done.

- Arguments
  - `{string} identifier`
- Returns `{boolean}`

### vm.\$calls.isPending(identifier)

### vm.\$callIsPending(identifier)

Gets if one or at least one of many calls is pending.

- Arguments
  - `{string} identifier`
- Returns `{boolean}`

## Development

### Test

```bash
yarn test
```

### Build

```bash
yarn build
```

## How to contribute

### Pull calls

1. Fork the repository
2. Create a new branch for each feature or improvement
3. Send a pull call from each feature branch to the **develop** branch

## License

[MIT](http://opensource.org/licenses/MIT)
