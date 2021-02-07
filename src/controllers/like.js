import { catchAsync } from '../utils/catchAsync';
import {
  respondWithSuccess,
  respondWithWarning,
} from '../helper/responseHandler';
import Like from '../models/like';

export const getUserLikedVideos = catchAsync(async (req, res, next) => {
  const { paginatedResults } = res;
  if (!paginatedResults.data.length) return respondWithWarning(res, 404, 'No video found', []);
  return respondWithSuccess(
    res,
    200,
    'liked videos fetched successfully',
    paginatedResults
  );
});

export const getUserLikeCount = catchAsync(async (req, res, next) => {
  const { id } = req.auth;
  const likeCount = await Like.countDocuments({likedBy: id});
  return respondWithSuccess(res, 200, 'like count fetched sucessfully', likeCount);
});
