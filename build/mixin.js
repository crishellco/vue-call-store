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

    this.$r = this.$requests = {
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
      }
    };
  }
};