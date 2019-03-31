'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  methods: {
    isDone: function isDone(identifier) {
      return _lodash2.default.get(this.$store.state.requests.requests, [identifier, 'status']) === _constants.requests.SUCCESS;
    },
    isFailed: function isFailed(identifier) {
      return _lodash2.default.get(this.$store.state.requests.requests, [identifier, 'status']) === _constants.requests.FAILED;
    },
    isPending: function isPending(identifier) {
      return _lodash2.default.get(this.$store.state.requests.requests, [identifier, 'status']) === _constants.requests.PENDING;
    }
  }
};