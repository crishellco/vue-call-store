import Vue from 'vue';

import App from './App.vue';
import store from './store';
import VueCallStore from '../../src';

Vue.use(VueCallStore, { minDuration: 2000, store });

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
