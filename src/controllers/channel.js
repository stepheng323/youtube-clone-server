import { catchAsync } from '../utils/catchAsync';
import Channel from '../models/channel';
import User from '../models/user';
import { respondWithSuccess, respondWithWarning } from '../helper/responseHandler';

export const createChannelWithUserAccount = catchAsync(async (req, res, next) => {
  const { id, firstName, lastName } = req.auth;
  const user = await User.findById(id);
  if (!user) return respondWithWarning(res, 404, 'No user Account found');
  const { avatar } = user;
  const channel = await Channel.create({
    name: `${firstName} ${lastName}`,
    owner: id,
    channelAvatar: avatar,
  });
  return respondWithSuccess(res, 201, 'Channel created successfuly', channel);
});

export const createChannel = catchAsync(async (req, res, next) => {console.log('me');});

export const getChannel = catchAsync(async (req, res, next) => {
  const { id } = req.auth;
  const channel = await Channel.find({ owner: id });
  if (!channel.length) return respondWithWarning(res, 404, 'No channel found for this user');
  return respondWithSuccess(res, 200, 'Channel info fetch', channel);
});
