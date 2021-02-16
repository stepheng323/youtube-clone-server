"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _channel = require("../../controllers/channel");

var _auth = require("../../middlewares/auth");

var _multer = require("../../config/multer");

var _pagination = _interopRequireDefault(require("../../middlewares/pagination"));

var _channel2 = _interopRequireDefault(require("../../models/channel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const channel = (0, _express.Router)();
channel.post('/', _auth.checkAuth, _channel.createChannel);
channel.post('/with-user-account', _auth.checkAuth, _channel.createChannelWithUserAccount);
channel.patch('/setup', _auth.checkAuth, _multer.uploadimage.single('channelAvatar'), _channel.setupAccount);
channel.get('/', _auth.checkAuth, _channel.getChannelInfo);
channel.get('/:channelName', _channel.getChannel);
channel.get('/all/channels', _auth.checkAuth, (0, _pagination.default)(_channel2.default, {}, [], [], '', ''), _channel.getAllChannels);
var _default = channel;
exports.default = _default;