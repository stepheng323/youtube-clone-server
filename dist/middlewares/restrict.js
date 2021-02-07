"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.restricTo = void 0;

var _responseHandler = require("../helper/responseHandler");

/* eslint-disable import/prefer-default-export */
const restricTo = (...roles) => (req, res, next) => {
  const {
    role
  } = req.user;

  if (!roles.includes(role)) {
    return (0, _responseHandler.respondWithWarning)(res, 403, 'You do not have permission to perform this action');
  }

  next();
};

exports.restricTo = restricTo;