"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllChannels = exports.getChannelInfo = exports.getChannel = exports.setupAccount = exports.createChannel = exports.createChannelWithUserAccount = void 0;

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
    name: `${firstName} ${lastName}`
  });
  if (channelExist) return (0, _responseHandler.respondWithWarning)(res, 409, 'A channel with this name exist');
  const channel = await _channel.default.create({
    name: `${firstName} ${lastName}`,
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
  const {
    channelName
  } = req.body;
  const {
    id
  } = req.auth;
  const channelExist = await _channel.default.findOne({
    name: channelName
  });
  if (channelExist) return (0, _responseHandler.respondWithWarning)(res, 409, 'a channel exist with that name');
  const channel = await _channel.default.create({
    owner: id,
    name: channelName
  });
  const {
    _id: channelId
  } = channel;
  await _user.default.findByIdAndUpdate({
    _id: id
  }, {
    channel: channelId
  }, {
    new: true
  });
  return (0, _responseHandler.respondWithSuccess)(res, 201, 'channel created succesfully', channel);
});
exports.createChannel = createChannel;
const setupAccount = (0, _catchAsync.catchAsync)(async (req, res, next) => {
  const {
    id
  } = req.auth;
  const {
    description: channelDescription
  } = req.body;
  const channelAvatar = req?.file?.path || '';
  const updateChannel = await _channel.default.findOneAndUpdate({
    owner: id
  }, {
    channelDescription,
    channelAvatar
  }, {
    new: true
  });
  return (0, _responseHandler.respondWithSuccess)(res, 200, 'channel setup successful', updateChannel);
});
exports.setupAccount = setupAccount;
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
const getChannelInfo = (0, _catchAsync.catchAsync)(async (req, res, next) => {
  const {
    id
  } = req.auth;
  const channelInfo = await _channel.default.find({
    owner: id
  });
  return (0, _responseHandler.respondWithSuccess)(res, 200, 'Channel info fetch', channelInfo);
});
exports.getChannelInfo = getChannelInfo;
const getAllChannels = (0, _catchAsync.catchAsync)(async (req, res, next) => {
  const {
    paginatedResults
  } = res;
  if (!paginatedResults.data.length) return (0, _responseHandler.respondWithWarning)(res, 404, 'no channel found');
  return (0, _responseHandler.respondWithSuccess)(res, 200, 'channels fetched successfully', paginatedResults);
});
exports.getAllChannels = getAllChannels;