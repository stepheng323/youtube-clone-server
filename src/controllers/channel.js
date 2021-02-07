import { catchAsync } from '../utils/catchAsync';
import Channel from '../models/channel';
import User from '../models/user';

import {
  respondWithSuccess,
  respondWithWarning,
} from '../helper/responseHandler';

export const createChannelWithUserAccount = catchAsync(
  async (req, res, next) => {
    const { id, firstName, lastName } = req.auth;
    const user = await User.findById(id);
    if (!user) return respondWithWarning(res, 404, 'No user Account found');
    const { avatar } = user;
    const channelExist = await Channel.findOne({
      name: `${firstName} ${lastName}`,
    });
    if (channelExist) return respondWithWarning(res, 409, 'A channel with this name exist');
    const channel = await Channel.create({
      name: `${firstName}${lastName}`,
      owner: id,
      channelAvatar: avatar,
    });
    const { _id: channelId } = channel;
    (
      await User.findByIdAndUpdate(
        { _id: id },
        { channel: channelId },
        { new: true }
      )
    ).save();
    return respondWithSuccess(res, 201, 'Channel created successfuly', channel);
  }
);

export const createChannel = catchAsync(async (req, res, next) => {
  const { channelName } = req.body;
  const { id } = req.auth;
  const channelExist = await Channel.findOne({ name: channelName });
  if (channelExist) return respondWithWarning(res, 409, 'a channel exist with that name');
  const channel = await Channel.create({ owner: id, name: channelName });
  const { _id: channelId } = channel;
  await User.findByIdAndUpdate(
    { _id: id },
    { channel: channelId },
    { new: true }
  );
  return respondWithSuccess(res, 201, 'channel created succesfully', channel);
});

export const setupAccount = catchAsync(async (req, res, next) => {
  const { id } = req.auth;
  const { description: channelDescription } = req.body;
  const channelAvatar = req?.file?.path || '';
  const updateChannel = await Channel.findOneAndUpdate(
    { owner: id },
    { channelDescription, channelAvatar },
    { new: true }
  );
  return respondWithSuccess(res, 200, 'channel setup successful', updateChannel);
});

export const getChannel = catchAsync(async (req, res, next) => {
  const { channelName } = req.params;
  const channel = await Channel.findOne({ name: channelName });
  if (!channel) return respondWithWarning(res, 404, 'No channel found for this user');
  return respondWithSuccess(res, 200, 'Channel info fetched successfully', channel);
});

export const getChannelInfo = catchAsync(async (req, res, next) => {
  const { id } = req.auth;
  const channelInfo = await Channel.find({ owner: id });
  return respondWithSuccess(res, 200, 'Channel info fetch', channelInfo);
});
