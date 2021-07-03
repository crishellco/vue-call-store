import Vuex from 'vuex';

import constants from './constants';
import directive from './directive';
import mixin from './mixin';
import moduleFactory from './module';
import VueCallDone from './components/VueCallDone.vue';
import VueCallFailed from './components/VueCallFailed.vue';
import VueCallPending from './components/VueCallPending.vue';

function install(Vue, { minDuration, store } = { minDuration: constants.MIN_DURATION }) {
  if (!store) {
    Vue.use(Vuex);
    store = new Vuex.Store();
    Vue.prototype.$store = store;
  }

  store.registerModule('calls', moduleFactory({ minDuration }), { preserveState: false });
  Vue.mixin(mixin);
  Vue.directive('call', directive);
  Vue.component('v-call-done', VueCallDone);
  Vue.component('v-call-failed', VueCallFailed);
  Vue.component('v-call-pending', VueCallPending);
}

export default install;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(install);
}
