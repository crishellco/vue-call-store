import Vue from 'vue';

import VueCallStore from '../../src';
import App from './App.vue';
import store from './store';

Vue.use(VueCallStore, { minDuration: 2000, store });

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
