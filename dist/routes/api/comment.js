"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _comment = require("../../controllers/comment");

var _auth = require("../../middlewares/auth");

var _pagination = _interopRequireDefault(require("../../middlewares/pagination"));

var _comments = _interopRequireDefault(require("../../models/comments"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const comment = (0, _express.Router)();
comment.post('/:videoId', _auth.checkAuth, _comment.saveComment);
comment.get('/:videoId', (0, _pagination.default)(_comments.default, {}, [], [{
  path: 'commenter',
  select: ['firstName', 'lastName']
}], {
  createdAt: 'desc'
}, 'video'), _comment.getComments);
var _default = comment;
exports.default = _default;