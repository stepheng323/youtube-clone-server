"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subcriptionsVideos = exports.getUserSubscriptionsCount = exports.channelSubscriptionCount = exports.getUserSubscriptionStatus = exports.channelSubscriptionCountVideo = exports.subscriptionList = exports.getSubscriptionStatus = exports.unSubscribeFromChannel = exports.subscribeToChannel = void 0;

var _catchAsync = require("../utils/catchAsync");

var _subscribers = _interopRequireDefault(require("../models/subscribers"));

var _responseHandler = require("../helper/responseHandler");

var _video = _interopRequireDefault(require("../models/video"));

var _channel = _interopRequireDefault(require("../models/channel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const subscribeToChannel = (0, _catchAsync.catchAsync)(async (req, res, next) => {
  const {
    id
  } = req.auth;
  const {
    channelId
  } = req.params;
  const subscription = await _subscribers.default.findOne({
    user: id,
    channel: channelId
  });
  if (subscription) return (0, _responseHandler.respondWithWarning)(res, 409, 'Already subcribed');
  await _subscribers.default.create({
    channel: channelId,
    user: id
  });
  const subscribedChannel = await _channel.default.findByIdAndUpdate({
    _id: channelId
  }, {
    $inc: {
      subscriberCount: 1
    }
  }, {
    new: true
  });
  const data = {
    channel: subscribedChannel
  };
  return (0, _responseHandler.respondWithSuccess)(res, 200, 'subcribed successfully', data);
});
exports.subscribeToChannel = subscribeToChannel;
const unSubscribeFromChannel = (0, _catchAsync.catchAsync)(async (req, res, next) => {
  const {
    id
  } = req.auth;
  const {
    channelId
  } = req.params;
  await _subscribers.default.findOneAndDelete({
    user: id,
    channel: channelId
  });
  const unSubscribedChannel = await _channel.default.findByIdAndUpdate({
    _id: channelId
  }, {
    $inc: {
      subscriberCount: -1
    }
  }, {
    new: true
  });
  const data = {
    channel: unSubscribedChannel
  };
  return (0, _responseHandler.respondWithSuccess)(res, 200, 'unsubcribed successfully', data);
});
exports.unSubscribeFromChannel = unSubscribeFromChannel;
const getSubscriptionStatus = (0, _catchAsync.catchAsync)(async (req, res, next) => {
  const {
    id
  } = req.auth;
  const {
    videoId
  } = req.params;
  const videoDetails = await _video.default.findById(videoId).populate('channel');
  if (!videoDetails) return (0, _responseHandler.respondWithWarning)(res, 404, 'no video with the id found');
  const {
    channel: {
      _id: channelId
    }
  } = videoDetails;
  const subscription = await _subscribers.default.findOne({
    user: id,
    channel: channelId
  });
  if (!subscription) return (0, _responseHandler.respondWithWarning)(res, 404, 'not subcribed to this channel');
  return (0, _responseHandler.respondWithSuccess)(res, 200, 'you are subcribed to this channel', true);
});
exports.getSubscriptionStatus = getSubscriptionStatus;
const subscriptionList = (0, _catchAsync.catchAsync)(async (req, res, next) => {
  const {
    paginatedResults
  } = res;
  if (!paginatedResults.data.length) return (0, _responseHandler.respondWithWarning)(res, 404, 'not subscribed to any channel');
  return (0, _responseHandler.respondWithSuccess)(res, 200, 'subscription fetched successfully', paginatedResults);
});
exports.subscriptionList = subscriptionList;
const channelSubscriptionCountVideo = (0, _catchAsync.catchAsync)(async (req, res, next) => {
  const {
    videoId
  } = req.params;
  const videoDetails = await _video.default.findById(videoId).populate('channel');
  if (!videoDetails) return (0, _responseHandler.respondWithWarning)(res, 404, 'no video with the id found');
  const {
    channel: {
      _id: channelId
    }
  } = videoDetails;
  const subscriptionCount = await _subscribers.default.countDocuments({
    channel: channelId
  });
  return (0, _responseHandler.respondWithSuccess)(res, 200, 'subscription count fetched successfully', subscriptionCount);
});
exports.channelSubscriptionCountVideo = channelSubscriptionCountVideo;
const getUserSubscriptionStatus = (0, _catchAsync.catchAsync)(async (req, res, next) => {
  const {
    channelName
  } = req.params;
  const {
    id
  } = req.auth;
  const channel = await _channel.default.findOne({
    name: channelName
  });
  if (!channelName) return (0, _responseHandler.respondWithWarning)(res, 404, 'no channel found');
  const {
    _id: channelId
  } = channel;
  const subscription = await _subscribers.default.findOne({
    user: id,
    channel: channelId
  });

  if (!subscription) {
    return (0, _responseHandler.respondWithWarning)(res, 404, 'not subcribed to this channel');
  }

  return (0, _responseHandler.respondWithSuccess)(res, 200, 'you are subcribed to this channel', true);
});
exports.getUserSubscriptionStatus = getUserSubscriptionStatus;
const channelSubscriptionCount = (0, _catchAsync.catchAsync)(async (req, res, next) => {
  const {
    channelName
  } = req.params;
  const channel = await _channel.default.findOne({
    name: channelName
  });
  if (!channelName) return (0, _responseHandler.respondWithWarning)(res, 404, 'no channel found');
  const {
    _id: channelId
  } = channel;
  const channelCount = await _subscribers.default.countDocuments({
    channel: channelId
  });
  return (0, _responseHandler.respondWithSuccess)(res, 200, 'subcriber count fetched successfully', channelCount);
});
exports.channelSubscriptionCount = channelSubscriptionCount;
const getUserSubscriptionsCount = (0, _catchAsync.catchAsync)(async (req, res, next) => {
  const {
    id
  } = req.auth;
  const subscriptionCount = await _subscribers.default.countDocuments({
    user: id
  });
  return (0, _responseHandler.respondWithSuccess)(res, 200, 'subscription count fetched successfully', subscriptionCount);
});
exports.getUserSubscriptionsCount = getUserSubscriptionsCount;
const subcriptionsVideos = (0, _catchAsync.catchAsync)(async (req, res, next) => {
  const {
    paginatedResults
  } = res;
  if (!paginatedResults.data.length) return (0, _responseHandler.respondWithWarning)(res, 404, 'no subscription videos found');
  const obj = {};
  paginatedResults.data.forEach(video => {
    const date = video.createdAt.toDateString();

    if (obj[date]) {
      obj[date].push(video);
    } else {
      obj[date] = [video];
    }
  });
  const groupArrays = Object.keys(obj).map(date => ({
    date,
    videos: obj[date]
  }));
  return (0, _responseHandler.respondWithSuccess)(res, 200, 'subscriptions videos fetched successfully', groupArrays);
});
exports.subcriptionsVideos = subcriptionsVideos;