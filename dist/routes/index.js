"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _auth = _interopRequireDefault(require("./api/auth"));

var _video = _interopRequireDefault(require("./api/video"));

var _channel = _interopRequireDefault(require("./api/channel"));

var _comment = _interopRequireDefault(require("./api/comment"));

var _history = _interopRequireDefault(require("./api/history"));

var _subscriber = _interopRequireDefault(require("./api/subscriber"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const apiRouter = (0, _express.Router)();
apiRouter.use('/api/v1/auth', _auth.default);
apiRouter.use('/api/v1/video', _video.default);
apiRouter.use('/api/v1/channel', _channel.default);
apiRouter.use('/api/v1/comment', _comment.default);
apiRouter.use('/api/v1/history', _history.default);
apiRouter.use('/api/v1/subscriber', _subscriber.default);
var _default = apiRouter;
exports.default = _default;