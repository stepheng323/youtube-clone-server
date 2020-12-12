import fs from 'fs';
import { respondWithSuccess, respondWithWarning } from '../helper/responseHandler';
import { catchAsync } from '../utils/catchAsync';
import Video from '../models/video';
import User from '../models/user';
import History from '../models/history';
import Channel from '../models/channel';

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
  const videos = await Video.find({ status: 'public' })
    .select(['title', 'thumbnail', 'viewsCount', 'duration', 'createdAt'])
    .populate('channel', ['name', 'channelAvatar']);
  if (!videos.length) return respondWithWarning(res, 404, 'No videos found', []);
  return respondWithSuccess(res, 200, 'Recommended vidoes fetched successfully', videos);
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


export const updateViewCount = catchAsync(async (req, res, next) => {
  const { videoId } = req.params;
  if (req.auth) {
    const { id } = req.auth;
    const today = new Date().toISOString().split('T')[0];
    const videoHistory = await History.find({
      user: id,
      video: videoId,
      date: today,
    });
    if (videoHistory.length < 5) {
      await Video.findByIdAndUpdate(
        { _id: videoId },
        { $inc: { viewsCount: 1 } },
        { new: true },
      );
    }
    await History.create({ video: videoId, user: id, date: today });
    return respondWithSuccess(res, 200, 'updated successfully');
  }
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
