import mixin from './mixin';
import module from './module';

function install(Vue, { options, store }) {
  Vue.mixin(mixin);
  store.registerModule('requests', module(options));
}

export default install;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(install);
}
