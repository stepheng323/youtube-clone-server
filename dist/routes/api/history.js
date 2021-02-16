"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _history = require("../../controllers/history");

var _auth = require("../../middlewares/auth");

var _pagination = _interopRequireDefault(require("../../middlewares/pagination"));

var _history2 = _interopRequireDefault(require("../../models/history"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const history = (0, _express.Router)();
history.get('/', _auth.checkAuth, (0, _pagination.default)(_history2.default, {}, [], [{
  path: 'video',
  select: ['title', 'description', 'thumbnail', 'duration', 'viewsCount', 'createdAt'],
  populate: {
    path: 'channel',
    select: ['name']
  }
}], {
  updatedAt: 'desc'
}, 'user'), _history.getUserHistory);
var _default = history;
exports.default = _default;