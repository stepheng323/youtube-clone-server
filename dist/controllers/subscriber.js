"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subscriptionList = exports.getSubscriptionStatus = exports.subscribeToChannel = void 0;

var _catchAsync = require("../utils/catchAsync");

var _subscribers = _interopRequireDefault(require("../models/subscribers"));

var _responseHandler = require("../helper/responseHandler");

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
  return (0, _responseHandler.respondWithSuccess)(res, 200, 'subcribed successfully');
});
exports.subscribeToChannel = subscribeToChannel;
const getSubscriptionStatus = (0, _catchAsync.catchAsync)(async (req, res, next) => {
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
  if (!subscription) return (0, _responseHandler.respondWithWarning)(res, 404, 'not subcribed to this channel');
  return (0, _responseHandler.respondWithSuccess)(res, 200, 'you are subcribed to this channel');
});
exports.getSubscriptionStatus = getSubscriptionStatus;
const subscriptionList = (0, _catchAsync.catchAsync)(async (req, res, next) => {
  const {
    id
  } = req.auth;
  const subscriptions = await _subscribers.default.find({
    user: id
  }).populate('channel');
  if (!subscriptions.length) return (0, _responseHandler.respondWithWarning)(res, 404, 'not subscribed to any channel');
  return (0, _responseHandler.respondWithSuccess)(res, 200, 'subscription fetched successfully', subscriptions);
});
exports.subscriptionList = subscriptionList;