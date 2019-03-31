'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mixin = require('./mixin');

var _mixin2 = _interopRequireDefault(_mixin);

var _module2 = require('./module');

var _module3 = _interopRequireDefault(_module2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function install(Vue, _ref) {
  var store = _ref.store;

  Vue.mixin(_mixin2.default);
  store.registerModule('requests', _module3.default);
}

exports.default = install;


if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(install);
}