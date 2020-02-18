# Vue Request Store

[![Codeship Status for crishellco/vue-request-store](https://app.codeship.com/projects/6fc2e700-35f9-0137-5a4a-56926ea83142/status?branch=master)](https://app.codeship.com/projects/332904)
![](badges/badge-branches.svg)
![](badges/badge-functionss.svg)
![](badges/badge-lines.svg)
![](badges/badge-statements.svg)

A Vue & Vuex plugin to simplify tracking API request statuses.

Vue Request Store provides a Vuex module and component methods to make it easy to update API request statuses and keep track of them.

- [Install](#install)
- [Examples](#examples)
  - [Update the status of a request](#update-the-status-of-a-request)
  - [Check the status of a request in a component](#check-the-status-of-a-request-in-a-component)
  - [Conditionally render with directives](#conditionally-render-with-directives)
  - [Conditionally render with components](#conditionally-render-with-components)
  - [Multiple identifer logic](#multiple-identifer-logic)
  - [Get the raw request object](#get-the-raw-request-object)
  - [Available mutations](#available-mutations)
- [Api](#api)
- [Development](#development)
  - [Lint](#lint)
  - [Test](#test) \* [Build](#build)
- [How to contribute](#how-to-contribute) \* [Pull requests](#pull-requests)
- [License](#license)

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

/**
 * If Vuex isn't installed,
 * it will be installed.
 */
Vue.use(Vuex);

const store = new Vuex.Store({});

/**
 * If a store isn't passed,
 * one will be created.
 */
Vue.use(VueRequestStore, { store });
```

## Examples

#### Update the status of a request

```javascript
/**
 * @arg {string} identifier
 * @arg {*} [message]
 */
vm.$requests.start('fetchUsers');
vm.$requests.end('fetchUsers');
vm.$requests.fail('fetchUsers', error);

// Example usage in a Vuex action
new Vuex.Store({
  actions: {
    fetchUsers({ commit }) {
      const identifier = 'fetchUsers';

      commit('requests/start', { identifier });

      axios
        .get('/api/users')
        .then(({data} => {
          commit('users/set', data);
          commit('requests/end', { identifier });
        })
        .catch(({response}) => {
          commit('requests/fail', { identifier, message: response.data.errors });
        });
    },
  },
});

```

#### Check the status of a request in a component

```javascript
/**
 * @arg {string | array} identifier
 * @returns {boolean}
 */

const isPending = vm.$requests.isPending('fetchUsers');
const isDone = vm.$requests.isDone('fetchUsers');
const hasFailed = vm.$requests.hasFailed(['fetchUsers', 'second']);
```

#### Conditionally render with directives

Directives accept string or array of identifiers.

```javascript
<template>
  <loading-indicator v-request:pending="'fetchUsers'" />

  <div v-request:done="'fetchUsers'" class="content">
    <ul>
      <li v-for="user in users" :key="user.id">{{ user.name }}</li>
    </ul>
  </div>

  <div v-request:failed="['fetchUsers', 'second']" class="content">
    Oops! Unable to fetch users.
  </div>
```

#### Conditionally render with components

Components' `identifier` props accept string or array of identifiers

```javascript
  <v-request-pending identifier="fetchUsers">
    <loading-indicator />
  </v-request-pending>

  <v-request-failed identifier="fetchUsers">
    <div class="content">
      <ul>
        <li v-for="user in users" :key="user.id">{{ user.name }}</li>
      </ul>
    </div>
  </v-request-failed>

  <v-request-failed :identifier="['fetchUsers', 'second']">
    <div class="content">
      Oops! Unable to fetch users.
    </div>
  </v-request-failed>
</template>
```

#### Multiple identifer logic

| State   | Method                                    | to be `true`                     |
| ------- | ----------------------------------------- | -------------------------------- |
| pending | `$requestIsPending | $requests.isPending` | at least one of many is pendsing |
| done    | `$requestIsDone | $requests.isDone`       | all are done                     |
| failed  | `$requestHasFailed | $requests.hasFailed` | has least one has failed         |

_[See Source](src/mixin.js)_

#### Get the raw request object

```javascript
/**
 * @arg {string} identifier
 * @arg {*} [defaultValue = null]
 * @returns {object|null}
 */
const notFoundValue = { status: 'done' };
const request = vm.$requests.get('fetchUsers', notFoundValue);

// Format
{
  _duration: 200, // milliseconds
  _started: moment('2019-04-02T15:19:05.000'), // or null
  _stopped: moment('2019-04-02T15:19:05.200'), // or null
  message: 'message',
  status: 'done',
}
```

#### Available mutations

_these mutations are useful in Vuex actions_

```javascript
vm.$store.commit('requests/start', { identifier, message });
vm.$store.commit('requests/end', { identifier, message });
vm.$store.commit('requests/fail', { identifier, message });
vm.$store.commit('requests/reset'); // Removes all request objects
```

## Api

#### vm.\$requests.end(identifier[, message])

#### vm.\$endRequest(identifier[, message])

Ends a request.

- Arguments
  - `{string} identifier`
  - `{*} message` optional
- Returns `{void}`

#### vm.\$requests.fail(identifier[, message])

#### vm.\$failRequest(identifier[, message])

Fails a request.

- Arguments
  - `{string} identifier`
  - `{*} message` optional
- Returns `{void}`

#### vm.\$requests.start(identifier[, message])

#### vm.\$startRequest(identifier[, message])

Starts a request.

- Arguments
  - `{string} identifier`
  - `{*} message` optional
- Returns `{void}`

#### vm.\$requests.request(identifier[, defaultValue])

#### vm.\$getRequest(identifier[, defaultValue])

#### vm.\$requests.get(identifier[, defaultValue])

Gets raw request.

- Arguments
  - `{string} identifier`
  - `{*} defaultValue (default: null)` optional
- Returns `{object}`

#### vm.\$requests.hasFailed(identifier)

#### vm.\$requestHasFailed(identifier)

Gets if one or at least one of many requests has failed.

- Arguments
  - `{string | array} identifier`
- Returns `{boolean}`

#### vm.\$requests.isDone(identifier)

#### vm.\$requestIsDone(identifier)

Gets if one or all requests are done.

- Arguments
  - `{string} identifier`
- Returns `{boolean}`

#### vm.\$requests.isPending(identifier)

#### vm.\$requestIsPending(identifier)

Gets if one or at least one of many requests is pending.

- Arguments
  - `{string} identifier`
- Returns `{boolean}`

## Development

#### Lint

```bash
yarn lint
```

#### Test

```bash
yarn test
```

#### Build

```bash
yarn build
```

## How to contribute

#### Pull requests

1. Fork the repository
2. Create a new branch for each feature or improvement
3. Send a pull request from each feature branch to the **develop** branch

## License

[MIT](http://opensource.org/licenses/MIT)
