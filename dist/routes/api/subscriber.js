"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _subscriber = require("../../controllers/subscriber");

var _auth = require("../../middlewares/auth");

const subscriber = (0, _express.Router)();
subscriber.post('/:channelId', _auth.checkAuth, _subscriber.subscribeToChannel);
subscriber.get('/subscription', _auth.checkAuth, _subscriber.subscriptionList);
subscriber.get('/:channelId', _auth.checkAuth, _subscriber.getSubscriptionStatus);
var _default = subscriber;
exports.default = _default;