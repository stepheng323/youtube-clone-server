"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getComments = exports.saveComment = void 0;

var _responseHandler = require("../helper/responseHandler");

var _catchAsync = require("../utils/catchAsync");

var _comments = _interopRequireDefault(require("../models/comments"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-underscore-dangle */
const saveComment = (0, _catchAsync.catchAsync)(async (req, res, next) => {
  const {
    videoId
  } = req.params;
  const {
    comment,
    responseTo
  } = req.body;
  const {
    id
  } = req.auth;
  const commentResult = await _comments.default.create({
    video: videoId,
    commenter: id,
    content: comment,
    responseTo
  });
  const commentDetails = await _comments.default.findById(commentResult._id).populate('commenter', 'firstName lastName');
  return (0, _responseHandler.respondWithSuccess)(res, 200, 'comment posted successfully', commentDetails);
});
exports.saveComment = saveComment;
const getComments = (0, _catchAsync.catchAsync)(async (req, res, next) => {
  if (!res.paginatedResults.data.length) return (0, _responseHandler.respondWithWarning)(res, 404, 'No comment found', []);
  return (0, _responseHandler.respondWithSuccess)(res, 200, 'comments fetched successfully', res.paginatedResults);
});
exports.getComments = getComments;