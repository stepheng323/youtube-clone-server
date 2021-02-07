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
const dislikeSchema = Schema({
  video: {
    type: Schema.Types.ObjectId,
    ref: 'Video'
  },
  dislikedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const DisLike = _mongoose.default.model('Dislike', dislikeSchema);

var _default = DisLike;
exports.default = _default;