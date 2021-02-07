/* eslint-disable no-underscore-dangle */
import { respondWithSuccess, respondWithWarning } from '../helper/responseHandler';
import { catchAsync } from '../utils/catchAsync';
import Comment from '../models/comments';

export const saveComment = catchAsync(async (req, res, next) => {
  const { videoId } = req.params;
  const { comment, responseTo } = req.body;
  const { id } = req.auth;
  const commentResult = await Comment.create({
    video: videoId,
    commenter: id,
    content: comment,
    responseTo,
  });
  const commentDetails = await Comment.findById(commentResult._id).populate('commenter', 'firstName lastName');
  return respondWithSuccess(res, 200, 'comment posted successfully', commentDetails);
});

export const getComments = catchAsync(async (req, res, next) => {
  if (!res.paginatedResults.data.length) return respondWithWarning(res, 404, 'No comment found', []);
  return respondWithSuccess(res, 200, 'comments fetched successfully', res.paginatedResults);
});
