import Vuex from 'vuex';

import constants from './constants';
import directive from './directive';
import mixin from './mixin';
import moduleFactory from './module';
import VueCallDone from './components/VueCallDone.vue';
import VueCallFailed from './components/VueCallFailed.vue';
import VueCallPending from './components/VueCallPending.vue';

export { VueCallDone, VueCallFailed, VueCallPending };

function install(
  Vue,
  { disablePromises, minDuration, store } = {
    disablePromises: false,
    minDuration: constants.MIN_DURATION
  }
) {
  if (!store) {
    Vue.use(Vuex);
    store = new Vuex.Store();
    Vue.prototype.$store = store;
  }

  const options = { disablePromises, minDuration };

  store.registerModule('calls', moduleFactory(options), { preserveState: false });
  Vue.mixin(mixin);
  Vue.directive('call', directive);
  Vue.component(VueCallDone.name, VueCallDone);
  Vue.component(VueCallFailed.name, VueCallFailed);
  Vue.component(VueCallPending.name, VueCallPending);
}

export default install;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(install);
}
