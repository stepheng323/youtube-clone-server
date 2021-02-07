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
const likeSchema = Schema({
  video: {
    type: Schema.Types.ObjectId,
    ref: 'Video'
  },
  likedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Like = _mongoose.default.model('Like', likeSchema);

var _default = Like;
exports.default = _default;