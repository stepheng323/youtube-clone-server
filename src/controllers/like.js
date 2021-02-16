import { catchAsync } from '../utils/catchAsync';
import {
  respondWithSuccess,
  respondWithWarning,
} from '../helper/responseHandler';
import Like from '../models/like';
import Video from '../models/video';

export const getUserLikedVideos = catchAsync(async (req, res, next) => {
  const { paginatedResults } = res;
  if (!paginatedResults.data.length) {
    return respondWithWarning(res, 404, 'No video found', []);
  }
  return respondWithSuccess(
    res,
    200,
    'liked videos fetched successfully',
    paginatedResults
  );
});

export const getUserLikeCount = catchAsync(async (req, res, next) => {
  const { id } = req.auth;
  const likeCount = await Like.countDocuments({ likedBy: id });
  return respondWithSuccess(
    res,
    200,
    'like count fetched sucessfully',
    likeCount
  );
});

export const watchLater = catchAsync(async (req, res, next) => {
  const { videoId: video } = req.params;
  const { id } = req.auth;
  const videoExist = await Video.findOne({ _id: video });
  if (!videoExist) return respondWithWarning(res, 404, 'no video with the id found');
  await Like.create({ video, likedBy: id, playlist: 'watch-later' });
  return respondWithSuccess(res, 200, 'add to watch later');
});

export const getWatchLaterVideos = catchAsync(async (req, res, next) => {
  const { paginatedResults } = res;
  if (!paginatedResults.data.length) {
    return respondWithWarning(res, 404, 'No video found', []);
  }
  return respondWithSuccess(
    res,
    200,
    'liked videos fetched successfully',
    paginatedResults
  );
});
