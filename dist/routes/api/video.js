"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _auth = require("../../middlewares/auth");

var _video = _interopRequireDefault(require("../../models/video"));

var _pagination = _interopRequireDefault(require("../../middlewares/pagination"));

var _video2 = require("../../controllers/video");

var _multer = require("../../config/multer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const video = (0, _express.Router)();
video.put('/', _auth.checkAuth, _multer.uploadvideo.single('video'), _video2.uploadVideo);
video.patch('/:id', _auth.checkAuth, _multer.uploadimage.single('thumbnail'), _video2.uploadVideoDetails);
video.get('/watch/:id', _video2.getVideo);
video.get('/details/:id', _video2.getVideoDetails);
video.get('/metric-count/:id', _video2.getMetrics);
video.get('/upnext/:query', _video2.getUpnextVideo);
video.patch('/view/:videoId', _auth.checkAuth, _video2.updateViewCount);
video.get('/recommended', (0, _pagination.default)(_video.default, {
  status: 'public'
}, ['title', 'thumbnail', 'viewsCount', 'duration', 'createdAt'], [{
  path: 'channel',
  select: ['name', 'channelAvatar']
}]), _video2.getRecommendedVideos);
video.get('/search/:searchQuery', _video2.search);
video.post('/like/:videoId', _auth.checkAuth, _video2.likeVideo);
video.post('/dislike/:videoId', _auth.checkAuth, _video2.dislikeVideo);
video.get('/trending', (0, _pagination.default)(_video.default, {}, ['-comments -status'], [{
  path: 'channel',
  select: ['name']
}], {
  createdAt: -1,
  viewsCount: 'desc'
}), _video2.getTrendingVideos);
var _default = video;
exports.default = _default;