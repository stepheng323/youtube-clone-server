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
const channelSchema = Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  subscriberCount: {
    type: Number,
    default: 0
  },
  channelAvatar: {
    type: String
  },
  videos: [{
    type: Schema.Types.ObjectId,
    ref: 'Video'
  }],
  channelDescription: {
    type: String
  }
}, {
  timestamps: true
});

const Channel = _mongoose.default.model('Channel', channelSchema);

var _default = Channel;
exports.default = _default;