"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getToken = exports.logout = exports.login = exports.signUp = void 0;

var _catchAsync = require("../utils/catchAsync");

var _bcrypt = require("../helper/bcrypt");

var _user = _interopRequireDefault(require("../models/user"));

var _responseHandler = require("../helper/responseHandler");

var _jwt = require("../helper/jwt");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-underscore-dangle */
const signUp = (0, _catchAsync.catchAsync)(async (req, res, next) => {
  const {
    password,
    email: submittedEmail
  } = req.body;
  const userExist = await _user.default.findOne({
    email: submittedEmail
  });
  if (userExist) return (0, _responseHandler.respondWithWarning)(res, 409, 'Email already signed up, try login');
  const hashedPassword = await (0, _bcrypt.bcryptHash)(password);
  const user = await _user.default.create({ ...req.body,
    password: hashedPassword,
    channel: null
  });
  const {
    firstName,
    lastName,
    _id: id,
    email
  } = user;
  const tokenAndTokenExpiry = await (0, _jwt.signToken)({
    firstName,
    lastName,
    email,
    id
  });
  const refreshToken = await (0, _jwt.signRefreshToken)({
    firstName,
    lastName,
    email,
    id
  });
  user.refreshToken = refreshToken;
  await user.save();
  user.password = undefined;
  res.cookie('refToken', refreshToken, {
    maxAge: 604800000,
    httpOnly: true
  });
  const {
    _doc: userData
  } = user;
  return (0, _responseHandler.respondWithSuccess)(res, 201, 'User Created Successfully', { ...userData,
    ...tokenAndTokenExpiry,
    refreshToken
  });
});
exports.signUp = signUp;
const login = (0, _catchAsync.catchAsync)(async (req, res, next) => {
  const {
    email,
    password
  } = req.body;
  const user = await _user.default.findOne({
    email
  }).populate('channel');
  if (!user) return (0, _responseHandler.respondWithWarning)(res, 404, 'Email or password mismatch');
  const {
    firstName,
    lastName,
    password: hashedPassword,
    _id: id,
    channel,
    avatar
  } = user;
  const passwordMatch = await (0, _bcrypt.comparePassword)(password, hashedPassword);
  if (!passwordMatch) return (0, _responseHandler.respondWithWarning)(res, 404, 'Email or password mismatch');
  const tokenAndTokenExpiry = await (0, _jwt.signToken)({
    firstName,
    lastName,
    email,
    id
  });
  const refreshToken = await (0, _jwt.signRefreshToken)({
    firstName,
    lastName,
    email,
    id
  });
  user.refreshToken = refreshToken;
  await user.save();
  res.cookie('refToken', refreshToken, {
    maxAge: 604800000,
    httpOnly: true
  });
  return (0, _responseHandler.respondWithSuccess)(res, 200, 'login successful', {
    firstName,
    lastName,
    email,
    channel,
    avatar,
    ...tokenAndTokenExpiry,
    refreshToken
  });
});
exports.login = login;
const logout = (0, _catchAsync.catchAsync)(async (req, res, next) => {
  res.clearCookie('refToken', {
    maxAge: 604800000,
    httpOnly: true
  });
  return (0, _responseHandler.respondWithSuccess)(res, 200, 'logout successfully');
});
exports.logout = logout;
const getToken = (0, _catchAsync.catchAsync)(async (req, res, next) => {
  const {
    refToken
  } = req.cookies;

  try {
    const user = await _user.default.findOne({
      refreshToken: refToken
    }).populate('channel');
    if (!user) return (0, _responseHandler.respondWithWarning)(res, 404, 'refresh token not found');
    const {
      channel,
      avatar
    } = user;
    const data = (0, _jwt.verifyRefreshToken)(user.refreshToken);

    if (data) {
      const {
        firstName,
        lastName,
        email,
        id
      } = data;
      const tokenAndTokenExpiry = await (0, _jwt.signToken)({
        firstName,
        lastName,
        email,
        id
      });
      return (0, _responseHandler.respondWithSuccess)(res, 200, 'token generated successfuly', { ...tokenAndTokenExpiry,
        ...data,
        channel,
        avatar
      });
    }
  } catch (error) {
    if (error.message === 'JsonWebTokenError') return (0, _responseHandler.respondWithWarning)(res, 401, 'invalid token');
    return (0, _responseHandler.respondWithWarning)(res, 401, error.message);
  }
});
exports.getToken = getToken;