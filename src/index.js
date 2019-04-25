import mixin from './mixin';
import module from './module';

function install(Vue, { store }) {
  Vue.mixin(mixin);
  store.registerModule('requests', module, { preserveState: false });
}

export default install;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(install);
}
