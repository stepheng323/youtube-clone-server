"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  Schema
} = _mongoose.default;
const subscriberSchema = Schema({
  channel: {
    type: Schema.Types.ObjectId,
    ref: 'Channel'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Subscriber = _mongoose.default.model('Subcriber', subscriberSchema);

var _default = Subscriber;
exports.default = _default;