"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyRefreshToken = exports.verifyToken = exports.signRefreshToken = exports.signToken = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const signToken = async data => {
  const token = await _jsonwebtoken.default.sign(data, process.env.TOKEN_SECRET_KEY, {
    expiresIn: process.env.TOKEN_EXPIRATION
  });

  const {
    exp: tokenExpiry
  } = _jsonwebtoken.default.decode(token);

  return {
    token,
    tokenExpiry
  };
};

exports.signToken = signToken;

const signRefreshToken = async data => {
  const refreshToken = await _jsonwebtoken.default.sign(data, process.env.REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRATION
  });
  return refreshToken;
};

exports.signRefreshToken = signRefreshToken;

const verifyToken = token => _jsonwebtoken.default.verify(token, process.env.TOKEN_SECRET_KEY);

exports.verifyToken = verifyToken;

const verifyRefreshToken = refreshToken => {
  const refToken = _jsonwebtoken.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);

  return refToken;
};

exports.verifyRefreshToken = verifyRefreshToken;