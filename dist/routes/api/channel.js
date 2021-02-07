"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _channel = require("../../controllers/channel");

var _auth = require("../../middlewares/auth");

const channel = (0, _express.Router)();
channel.post('/with-user-account', _auth.checkAuth, _channel.createChannelWithUserAccount);
channel.post('/', _auth.checkAuth, _channel.createChannel);
channel.get('/count', _auth.checkAuth, _channel.getChannelCount);
channel.get('/:channelName', _channel.getChannel);
var _default = channel;
exports.default = _default;