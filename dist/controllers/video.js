"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTrendingVideos = exports.getMetrics = exports.dislikeVideo = exports.likeVideo = exports.search = exports.updateViewCount = exports.getUpnextVideo = exports.getVideoDetails = exports.getVideo = exports.getRecommendedVideos = exports.uploadVideoDetails = exports.uploadVideo = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _responseHandler = require("../helper/responseHandler");

var _catchAsync = require("../utils/catchAsync");

var _video = _interopRequireDefault(require("../models/video"));

var _user = _interopRequireDefault(require("../models/user"));

var _history = _interopRequireDefault(require("../models/history"));

var _channel = _interopRequireDefault(require("../models/channel"));

var _like = _interopRequireDefault(require("../models/like"));

var _dislike = _interopRequireDefault(require("../models/dislike"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const uploadVideo = (0, _catchAsync.catchAsync)(async (req, res, next) => {
  if (!req.auth) return (0, _responseHandler.respondWithWarning)(res, 401, 'Please sign in to continue');
  if (!req.file) return (0, _responseHandler.respondWithWarning)(res, 404, 'No file Uploaded');
  const {
    id
  } = req.auth;
  const {
    path
  } = req.file;
  const user = await _user.default.findById(id).populate('channel');
  const {
    _id: channelId
  } = user.channel;
  const video = await _video.default.create({
    channel: channelId,
    videoUrl: path
  });
  return (0, _responseHandler.respondWithSuccess)(res, 200, 'uploaded successfuly', video);
});
exports.uploadVideo = uploadVideo;
const uploadVideoDetails = (0, _catchAsync.catchAsync)(async (req, res, next) => {
  if (!req.auth) return (0, _responseHandler.respondWithWarning)(res, 401, 'Please sign in to continue');
  if (!req.file) return (0, _responseHandler.respondWithWarning)(res, 400, 'no file uploaded');
  const {
    id
  } = req.auth;
  const {
    id: videoId
  } = req.params;
  const user = await _user.default.findById(id).populate('channel');
  const {
    title,
    description,
    duration
  } = req.body;
  const {
    _id: channelId
  } = user.channel;
  const thumbnail = req.file.path;
  const video = await _video.default.findByIdAndUpdate({
    _id: videoId
  }, {
    thumbnail,
    title,
    description,
    channel: channelId,
    duration,
    status: 'public'
  }, {
    new: true
  });
  return (0, _responseHandler.respondWithSuccess)(res, 201, 'Video created successffuly', video);
});
exports.uploadVideoDetails = uploadVideoDetails;
const getRecommendedVideos = (0, _catchAsync.catchAsync)(async (req, res, next) => {
  const {
    paginatedResults
  } = res;
  if (!paginatedResults.data.length) return (0, _responseHandler.respondWithWarning)(res, 404, 'No videos found', []);
  return (0, _responseHandler.respondWithSuccess)(res, 200, 'Recommended vidoes fetched successfully', paginatedResults);
});
exports.getRecommendedVideos = getRecommendedVideos;
const getVideo = (0, _catchAsync.catchAsync)(async (req, res, next) => {
  const {
    range
  } = req.headers;
  if (!range) return (0, _responseHandler.respondWithWarning)(res, 400, 'Range header is required');
  const {
    id
  } = req.params;
  const {
    videoUrl
  } = await _video.default.findById(id);

  const videoSize = _fs.default.statSync(videoUrl).size;

  const chunkSize = 10 ** 4;
  const start = Number(range.replace(/\D/g, ''));
  const end = Math.min(start + chunkSize, videoSize - 1);
  const contentLength = end - start + 1;
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': 'video/mp4'
  };
  res.writeHead(206, headers);

  const videoStream = _fs.default.createReadStream(videoUrl, {
    start,
    end
  });

  videoStream.pipe(res);
});
exports.getVideo = getVideo;
const getVideoDetails = (0, _catchAsync.catchAsync)(async (req, res, next) => {
  const {
    id
  } = req.params;
  const videoDetails = await _video.default.findById(id).populate('channel');
  if (!videoDetails) return (0, _responseHandler.respondWithWarning)(res, 404, 'No info found');
  return (0, _responseHandler.respondWithSuccess)(res, 200, 'video details fetched successfully', videoDetails);
});
exports.getVideoDetails = getVideoDetails;
const getUpnextVideo = (0, _catchAsync.catchAsync)(async (req, res, next) => {
  const {
    query
  } = req.params;
  const relatedVideos = await _video.default.find({
    $or: [{
      title: {
        $regex: query,
        $options: 'i'
      }
    }, {
      description: {
        $regex: query,
        $options: 'i'
      }
    }]
  }).populate('channel');
  const videos = await _video.default.find().populate('channel');
  const combinedResult = [...relatedVideos, ...videos];
  const upNextVideos = [...new Set(combinedResult.filter(i => i.title !== query))];
  if (!upNextVideos.length) return (0, _responseHandler.respondWithWarning)(res, 404, 'no videos found');
  return (0, _responseHandler.respondWithSuccess)(res, 200, 'videos fetched successfully', upNextVideos);
});
exports.getUpnextVideo = getUpnextVideo;
const updateViewCount = (0, _catchAsync.catchAsync)(async (req, res, next) => {
  const {
    videoId
  } = req.params;

  if (req.auth) {
    const {
      id
    } = req.auth;
    const videoHistory = await _history.default.find({
      user: id,
      video: videoId
    });

    if (videoHistory.length < 5) {
      await _video.default.findByIdAndUpdate({
        _id: videoId
      }, {
        $inc: {
          viewsCount: 1
        }
      }, {
        new: true
      });
    }

    await _history.default.create({
      video: videoId,
      user: id
    });
    return (0, _responseHandler.respondWithSuccess)(res, 200, 'updated successfully');
  }
});
exports.updateViewCount = updateViewCount;
const search = (0, _catchAsync.catchAsync)(async (req, res, next) => {
  const {
    searchQuery
  } = req.params;
  const foundChannels = await _channel.default.find({
    $or: [{
      name: {
        $regex: searchQuery,
        $options: 'i'
      }
    }, {
      description: {
        $regex: searchQuery,
        $options: 'i'
      }
    }]
  }).select('-createdAt -updatedAt -owner');
  const foundVideos = await _video.default.find({
    $or: [{
      title: {
        $regex: searchQuery,
        $options: 'i'
      }
    }, {
      description: {
        $regex: searchQuery,
        $options: 'i'
      }
    }]
  }).select('-likes -dislikes -comments -status -updatedAt -__v').populate('channel').populate('likes');
  const combinedResult = [...foundChannels, ...foundVideos];
  if (!combinedResult.length) return (0, _responseHandler.respondWithWarning)(res, 404, 'search query does not match document');
  return (0, _responseHandler.respondWithSuccess)(res, 200, 'result fetch successfully', combinedResult);
});
exports.search = search;
const likeVideo = (0, _catchAsync.catchAsync)(async (req, res, next) => {
  const {
    videoId
  } = req.params;
  const {
    id
  } = req.auth;
  await _like.default.create({
    video: videoId,
    likedBy: id
  });
  await _video.default.findByIdAndUpdate({
    _id: videoId
  }, {
    viewsCount: 1
  });
  return (0, _responseHandler.respondWithSuccess)(res, 200, 'video liked successfully');
});
exports.likeVideo = likeVideo;
const dislikeVideo = (0, _catchAsync.catchAsync)(async (req, res, next) => {
  const {
    videoId
  } = req.params;
  const {
    id
  } = req.auth;
  await _dislike.default.create({
    video: videoId,
    dislikedBy: id
  });
  return (0, _responseHandler.respondWithSuccess)(res, 200, 'video disliked successfully');
});
exports.dislikeVideo = dislikeVideo;
const getMetrics = (0, _catchAsync.catchAsync)(async (req, res, next) => {
  const {
    id
  } = req.params;
  const likesCount = await _like.default.countDocuments({
    video: id
  });
  const dislikesCount = await _dislike.default.countDocuments({
    video: id
  });
  const result = {
    likesCount,
    dislikesCount
  };
  return (0, _responseHandler.respondWithSuccess)(res, 200, 'counts fetched successfully', result);
});
exports.getMetrics = getMetrics;
const getTrendingVideos = (0, _catchAsync.catchAsync)(async (req, res, next) => {
  const {
    paginatedResults
  } = res;
  if (!paginatedResults.data.length) return (0, _responseHandler.respondWithWarning)(res, 404, 'no trending videos found');
  return (0, _responseHandler.respondWithSuccess)(res, 200, 'trending videos fteched successfully', paginatedResults);
});
exports.getTrendingVideos = getTrendingVideos;