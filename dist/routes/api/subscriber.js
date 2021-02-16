"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _subscriber = require("../../controllers/subscriber");

var _auth = require("../../middlewares/auth");

var _pagination = _interopRequireDefault(require("../../middlewares/pagination"));

var _subscribers = _interopRequireDefault(require("../../models/subscribers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const subscriber = (0, _express.Router)();
subscriber.post('/subscribe/:channelId', _auth.checkAuth, _subscriber.subscribeToChannel);
subscriber.post('/unsubscribe/:channelId', _auth.checkAuth, _subscriber.unSubscribeFromChannel);
subscriber.get('/subscription', _auth.checkAuth, (0, _pagination.default)(_subscribers.default, {}, [], [{
  path: 'channel'
}], '', 'user'), _subscriber.subscriptionList);
subscriber.get('/status/:channelName', _auth.checkAuth, _subscriber.getUserSubscriptionStatus);
subscriber.get('/count', _auth.checkAuth, _subscriber.getUserSubscriptionsCount);
subscriber.get('/:videoId', _auth.checkAuth, _subscriber.getSubscriptionStatus);
subscriber.get('/channel/count/:channelName', _subscriber.channelSubscriptionCount);
subscriber.get('/count/:videoId', _subscriber.channelSubscriptionCountVideo);
var _default = subscriber;
exports.default = _default;