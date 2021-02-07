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
const commentSchema = Schema({
  commenter: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  responseTo: {
    type: String
  },
  video: {
    type: Schema.Types.ObjectId,
    ref: 'Video'
  },
  content: {
    type: String
  }
}, {
  timestamps: true
});

const Comment = _mongoose.default.model('Comment', commentSchema);

var _default = Comment;
exports.default = _default;