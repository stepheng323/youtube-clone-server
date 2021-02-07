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
const videoSchema = Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  videoUrl: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String
  },
  channel: {
    type: Schema.Types.ObjectId,
    ref: 'Channel'
  },
  viewsCount: {
    type: Number,
    default: 0
  },
  duration: {
    type: String
  },
  status: {
    type: String,
    default: 'draft'
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }]
}, {
  timestamps: true
});

const Video = _mongoose.default.model('Video', videoSchema);

var _default = Video;
exports.default = _default;