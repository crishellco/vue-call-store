'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _constants = require('./constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  beforeMount: function beforeMount() {
    var _this = this;

    this.$r = {
      end: function end(identifier) {
        var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        _this.$store.commit('requests/end', { identifier: identifier, message: message });
      },
      fail: function fail(identifier) {
        var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        _this.$store.commit('requests/fail', { identifier: identifier, message: message });
      },
      get: function get(identifier) {
        var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        return _lodash2.default.get(_this.$store.state.requests.requests, [identifier], defaultValue);
      },
      isDone: function isDone(identifier) {
        return _lodash2.default.get(_this.$store.state.requests.requests, [identifier, 'status']) === _constants2.default.SUCCESS;
      },
      isFailed: function isFailed(identifier) {
        return _lodash2.default.get(_this.$store.state.requests.requests, [identifier, 'status']) === _constants2.default.FAILED;
      },
      isPending: function isPending(identifier) {
        return _lodash2.default.get(_this.$store.state.requests.requests, [identifier, 'status']) === _constants2.default.PENDING;
      },
      start: function start(identifier) {
        var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        _this.$store.commit('requests/start', { identifier: identifier, message: message });
      }
    };
  }
};