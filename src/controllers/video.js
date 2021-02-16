/* eslint-disable no-underscore-dangle */
import fs from 'fs';
import { respondWithSuccess, respondWithWarning } from '../helper/responseHandler';
import { catchAsync } from '../utils/catchAsync';
import Video from '../models/video';
import User from '../models/user';
import History from '../models/history';
import Channel from '../models/channel';
import Like from '../models/like';
import Dislike from '../models/dislike';

export const uploadVideo = catchAsync(async (req, res, next) => {
  if (!req.auth) return respondWithWarning(res, 401, 'Please sign in to continue');
  if (!req.file) return respondWithWarning(res, 404, 'No file Uploaded');
  const { id } = req.auth;
  const { path } = req.file;
  const user = await User.findById(id).populate('channel');
  const { _id: channelId } = user.channel;
  const video = await Video.create({ channel: channelId, videoUrl: path });
  return respondWithSuccess(res, 200, 'uploaded successfuly', video);
});

export const uploadVideoDetails = catchAsync(async (req, res, next) => {
  if (!req.auth) return respondWithWarning(res, 401, 'Please sign in to continue');
  if (!req.file) return respondWithWarning(res, 400, 'no file uploaded');
  const { id } = req.auth;
  const { id: videoId } = req.params;
  const user = await User.findById(id).populate('channel');
  const { title, description, duration } = req.body;
  const { _id: channelId } = user.channel;
  const thumbnail = req.file.path;

  const video = await Video.findByIdAndUpdate(
    { _id: videoId },
    {
      thumbnail,
      title,
      description,
      channel: channelId,
      duration,
      status: 'public',
    },
    { new: true },
  );
  return respondWithSuccess(res, 201, 'Video created successffuly', video);
});

export const getRecommendedVideos = catchAsync(async (req, res, next) => {
  const { paginatedResults } = res;
  if (!paginatedResults.data.length) return respondWithWarning(res, 404, 'No videos found', []);
  return respondWithSuccess(res, 200, 'Recommended vidoes fetched successfully', paginatedResults);
});

export const getVideo = catchAsync(async (req, res, next) => {
  const { range } = req.headers;
  if (!range) return respondWithWarning(res, 400, 'Range header is required');
  const { id } = req.params;
  const { videoUrl } = await Video.findById(id);
  const videoSize = fs.statSync(videoUrl).size;
  const chunkSize = 10 ** 4;
  const start = Number(range.replace(/\D/g, ''));
  const end = Math.min(start + chunkSize, videoSize - 1);

  const contentLength = end - start + 1;
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': 'video/mp4',
  };
  res.writeHead(206, headers);
  const videoStream = fs.createReadStream(videoUrl, { start, end });
  videoStream.pipe(res);
});

export const getVideoDetails = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const videoDetails = await Video.findById(id).populate('channel');
  if (!videoDetails) return respondWithWarning(res, 404, 'No info found');
  return respondWithSuccess(res, 200, 'video details fetched successfully', videoDetails);
});

export const getUpnextVideo = catchAsync(async (req, res, next) => {
  const { paginatedResults } = res;
  if (!paginatedResults.data.length) return respondWithWarning(res, 404, 'No videos found', []);
  return respondWithSuccess(res, 200, 'videos fetched successfully', paginatedResults);
});

export const updateViewCount = catchAsync(async (req, res, next) => {
  const { videoId } = req.params;
  if (req.auth) {
    const { id } = req.auth;
    const video = await History.findOne({
      user: id,
      video: videoId,
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59))
      }
    });

    // update history
    if (video) {
      await History.findByIdAndUpdate(
        { _id: video._id },
        { updatedAt: new Date() },
        { new: true },
      );
    }
    if (!video) await History.create({ video: videoId, user: id });
    await Video.findByIdAndUpdate(
      { _id: videoId },
      { $inc: { viewsCount: 1 } },
      { new: true },
    );
  }

  return respondWithSuccess(res, 200, 'updated successfully');
});

export const search = catchAsync(async (req, res, next) => {
  const { searchQuery } = req.params;
  const foundChannels = await Channel.find({
    $or: [
      { name: { $regex: searchQuery, $options: 'i' } },
      { description: { $regex: searchQuery, $options: 'i' } },
    ],
  }).select('-createdAt -updatedAt -owner');
  const foundVideos = await Video.find({
    $or: [
      { title: { $regex: searchQuery, $options: 'i' } },
      { description: { $regex: searchQuery, $options: 'i' } },
    ],
  })
    .select('-likes -dislikes -comments -status -updatedAt -__v')
    .populate('channel')
    .populate('likes');
  const combinedResult = [...foundChannels, ...foundVideos];
  if (!combinedResult.length) return respondWithWarning(res, 404, 'search query does not match document');
  return respondWithSuccess(
    res,
    200,
    'result fetch successfully',
    combinedResult,
  );
});

export const likeVideo = catchAsync(async (req, res, next) => {
  const { videoId } = req.params;
  const { id } = req.auth;
  await Like.create({ video: videoId, likedBy: id, playlist: 'like' });
  await Dislike.findOneAndDelete({ video: videoId, dislikedBy: id, playlist: 'disliked' });
  return respondWithSuccess(res, 200, 'video liked successfully');
});

export const dislikeVideo = catchAsync(async (req, res, next) => {
  const { videoId } = req.params;
  const { id } = req.auth;
  await Dislike.create({ video: videoId, dislikedBy: id, playlist: 'liked' });
  await Like.findOneAndDelete({ video: videoId, likedBy: id });
  return respondWithSuccess(res, 200, 'video disliked successfully');
});

export const getMetrics = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const likesCount = await Like.countDocuments({ video: id });
  const dislikesCount = await Dislike.countDocuments({ video: id });
  const result = { likesCount, dislikesCount };
  return respondWithSuccess(res, 200, 'counts fetched successfully', result);
});

export const getTrendingVideos = catchAsync(async (req, res, next) => {
  const { paginatedResults } = res;
  if (!paginatedResults.data.length) return respondWithWarning(res, 404, 'no trending videos found');
  return respondWithSuccess(res, 200, 'trending videos fteched successfully', paginatedResults);
});

export const getVideoLikeCount = catchAsync(async (req, res, next) => {
  const { videoId } = req.params;
  const likeCount = await Like.countDocuments({ video: videoId });
  return respondWithSuccess(res, 200, 'like count fetched successfully', likeCount);
});

export const getVideoDislikeCount = catchAsync(async (req, res, next) => {
  const { videoId } = req.params;
  const dislikeCount = await Dislike.countDocuments({ video: videoId });
  return respondWithSuccess(res, 200, 'dislike count fetched successfully', dislikeCount);
});

export const getFeelingStatus = catchAsync(async (req, res, next) => {
  const { videoId } = req.params;
  const { id } = req.auth;
  const like = await Like.findOne({ video: videoId, likedBy: id });
  const dislike = await Dislike.findOne({ video: videoId, dislikedBy: id });
  const response = {
    hasFeeling: !!(like || dislike),
    like: !!like,
    dislike: !!dislike,
  };
  return respondWithSuccess(res, 200, 'feeling fetched successfully', response);
});

export const getChannelVideos = catchAsync(async (req, res, next) => {
  const { channelName } = req.params;
  const channel = await Channel.findOne({ name: channelName });
  if (!channel) return respondWithWarning(res, 404, `no channel found with ${channelName}`);
  // eslint-disable-next-line no-underscore-dangle
  const videos = await Video.find({ channel: channel._id });
  if (!videos.length) return respondWithWarning(res, 404, 'No videos found for this channel');
  return respondWithWarning(res, 200, 'videos fetched successfully', videos);
});

export const getChannelPlaylist = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const playlist = await Like.find({
    $and: [
      { likedBy: id },
      { $or: [{ playlist: 'liked' }] },
      { $or: [{ playlist: 'watched later' }] },
    ]
  });
  if (!playlist.length) return respondWithWarning(res, 404, 'no video found');
  return respondWithSuccess(res, 200, 'videos fetched successfully', playlist);
});

export const getVideoCount = catchAsync(async (req, res, next) => {
  const { id } = req.auth;
  const channel = await Channel.findOne({ owner: id });
  if (!channel) return respondWithWarning(res, 404, 'no channel found');
  const { _id: channelId } = channel;
  const videosCount = await Video.countDocuments({ channel: channelId });
  return respondWithSuccess(res, 200, 'video count fetched successfully', videosCount);
});
