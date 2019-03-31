'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _constants = require('./constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function updateRequest(state, _ref, status) {
  var identifier = _ref.identifier,
      message = _ref.message;

  _vue2.default.set(state.requests, identifier, { status: status, message: message });
}

exports.default = {
  namespaced: true,

  mutations: {
    end: function end(state, payload) {
      updateRequest(state, payload, _constants2.default.SUCCESS);
    },
    fail: function fail(state, payload) {
      updateRequest(state, payload, _constants2.default.FAILED);
    },
    start: function start(state, payload) {
      updateRequest(state, payload, _constants2.default.PENDING);
    }
  },

  state: {
    requests: {}
  }
};