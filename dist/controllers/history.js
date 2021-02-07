"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.js = exports.getUserHistory = void 0;

var _responseHandler = require("../helper/responseHandler");

var _catchAsync = require("../utils/catchAsync");

const getUserHistory = (0, _catchAsync.catchAsync)(async (req, res, next) => {
  const {
    paginatedResults
  } = res;
  if (!paginatedResults.data.length) return (0, _responseHandler.respondWithWarning)(res, 404, 'no trending videos found');
  return (0, _responseHandler.respondWithSuccess)(res, 200, 'video history fetched successfully', paginatedResults);
});
exports.getUserHistory = getUserHistory;

const js = () => {};

exports.js = js;