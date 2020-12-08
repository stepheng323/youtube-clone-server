import { catchAsync } from '../utils/catchAsync';
import Channel from '../models/channel';
import User from '../models/user';
import { respondWithSuccess, respondWithWarning } from '../helper/responseHandler';

export const createChannelWithUserAccount = catchAsync(async (req, res, next) => {
  const { id, firstName, lastName } = req.auth;
  const user = await User.findById(id);
  if (!user) return respondWithWarning(res, 404, 'No user Account found');
  const { avatar } = user;
  const channelExist = await Channel.findOne({ name: `${firstName}${lastName}` });
  if (channelExist) return respondWithWarning(res, 409, 'A channel with this name exist');
  const channel = await Channel.create({
    name: `${firstName}${lastName}`,
    owner: id,
    channelAvatar: avatar,
  });
  const { _id: channelId } = channel;
  (await User.findByIdAndUpdate({ _id: id }, { channel: channelId }, { new: true })).save();
  return respondWithSuccess(res, 201, 'Channel created successfuly', channel);
});

export const createChannel = catchAsync(async (req, res, next) => {console.log('me');});

export const getChannel = catchAsync(async (req, res, next) => {
  const { channelName } = req.params;
  const channel = await Channel.findOne({ name: channelName });
  if (!channel) return respondWithWarning(res, 404, 'No channel found for this user');
  return respondWithSuccess(res, 200, 'Channel info fetched successfully', channel);
});

export const getChannelCount = catchAsync(async (req, res, next) => {
  const { id } = req.auth;
  const channelCount = await Channel.find({ owner: id }).count();
  return respondWithSuccess(res, 200, 'Channel info fetch', channelCount);
});
