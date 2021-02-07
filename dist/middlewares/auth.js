"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkAuth = void 0;

var _jwt = require("../helper/jwt");

var _responseHandler = require("../helper/responseHandler");

// eslint-disable-next-line import/prefer-default-export
const checkAuth = (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  if (!token) {
    req.auth = '';
    return next();
  }

  try {
    const data = (0, _jwt.verifyToken)(token);
    req.auth = data;
    return next();
  } catch (error) {
    if (error.message === 'JsonWebTokenError') return (0, _responseHandler.respondWithWarning)(res, 401, 'invalid token');
    return (0, _responseHandler.respondWithWarning)(res, 401, error.message);
  }
};

exports.checkAuth = checkAuth;