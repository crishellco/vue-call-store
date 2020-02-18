import Vuex from 'vuex';

import directive from './directive';
import mixin from './mixin';
import module from './module';
import VueRequestDone from './components/VueRequestDone.vue';
import VueRequestFailed from './components/VueRequestFailed.vue';
import VueRequestPending from './components/VueRequestPending.vue';

function install(Vue, { store } = {}) {
  if (!store) {
    Vue.use(Vuex);
    store = new Vuex.Store();
    Vue.prototype.$store = store;
  }

  store.registerModule('requests', module, { preserveState: false });
  Vue.mixin(mixin);
  Vue.directive('request', directive);
  Vue.component('v-request-done', VueRequestDone);
  Vue.component('v-request-failed', VueRequestFailed);
  Vue.component('v-request-pending', VueRequestPending);
}

export default install;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(install);
}
