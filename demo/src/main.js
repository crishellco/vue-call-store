import Vue from 'vue';
import App from './App.vue';
import VueCallStore from '../../src';
import store from './store';

Vue.use(VueCallStore, { store });

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
