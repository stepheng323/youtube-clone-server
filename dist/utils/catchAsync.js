"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.catchAsync = void 0;

/* eslint-disable import/prefer-default-export */
const catchAsync = func => (req, res, next) => {
  func(req, res, next).catch(next);
};

exports.catchAsync = catchAsync;