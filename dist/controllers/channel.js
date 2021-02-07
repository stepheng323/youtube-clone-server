"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getChannelCount = exports.getChannel = exports.createChannel = exports.createChannelWithUserAccount = void 0;

var _catchAsync = require("../utils/catchAsync");

var _channel = _interopRequireDefault(require("../models/channel"));

var _user = _interopRequireDefault(require("../models/user"));

var _responseHandler = require("../helper/responseHandler");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createChannelWithUserAccount = (0, _catchAsync.catchAsync)(async (req, res, next) => {
  const {
    id,
    firstName,
    lastName
  } = req.auth;
  const user = await _user.default.findById(id);
  if (!user) return (0, _responseHandler.respondWithWarning)(res, 404, 'No user Account found');
  const {
    avatar
  } = user;
  const channelExist = await _channel.default.findOne({
    name: `${firstName}${lastName}`
  });
  if (channelExist) return (0, _responseHandler.respondWithWarning)(res, 409, 'A channel with this name exist');
  const channel = await _channel.default.create({
    name: `${firstName}${lastName}`,
    owner: id,
    channelAvatar: avatar
  });
  const {
    _id: channelId
  } = channel;
  (await _user.default.findByIdAndUpdate({
    _id: id
  }, {
    channel: channelId
  }, {
    new: true
  })).save();
  return (0, _responseHandler.respondWithSuccess)(res, 201, 'Channel created successfuly', channel);
});
exports.createChannelWithUserAccount = createChannelWithUserAccount;
const createChannel = (0, _catchAsync.catchAsync)(async (req, res, next) => {
  console.log('me');
});
exports.createChannel = createChannel;
const getChannel = (0, _catchAsync.catchAsync)(async (req, res, next) => {
  const {
    channelName
  } = req.params;
  const channel = await _channel.default.findOne({
    name: channelName
  });
  if (!channel) return (0, _responseHandler.respondWithWarning)(res, 404, 'No channel found for this user');
  return (0, _responseHandler.respondWithSuccess)(res, 200, 'Channel info fetched successfully', channel);
});
exports.getChannel = getChannel;
const getChannelCount = (0, _catchAsync.catchAsync)(async (req, res, next) => {
  const {
    id
  } = req.auth;
  const channelCount = await _channel.default.find({
    owner: id
  }).count();
  return (0, _responseHandler.respondWithSuccess)(res, 200, 'Channel info fetch', channelCount);
});
exports.getChannelCount = getChannelCount;