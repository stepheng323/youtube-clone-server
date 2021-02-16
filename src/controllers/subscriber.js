import { catchAsync } from '../utils/catchAsync';
import Subscriber from '../models/subscribers';
import {
  respondWithSuccess,
  respondWithWarning,
} from '../helper/responseHandler';
import Video from '../models/video';
import Channel from '../models/channel';

export const subscribeToChannel = catchAsync(async (req, res, next) => {
  const { id } = req.auth;
  const { channelId } = req.params;
  const subscription = await Subscriber.findOne({
    user: id,
    channel: channelId,
  });
  if (subscription) return respondWithWarning(res, 409, 'Already subcribed');
  await Subscriber.create({
    channel: channelId,
    user: id,
  });
  const subscribedChannel = await Channel.findByIdAndUpdate(
    { _id: channelId },
    { $inc: { channelCount: 1 } },
    { new: true }
  );
  const data = { channel: subscribedChannel };
  return respondWithSuccess(res, 200, 'subcribed successfully', data);
});

export const unSubscribeFromChannel = catchAsync(async (req, res, next) => {
  const { id } = req.auth;
  const { channelId } = req.params;
  await Subscriber.findOneAndDelete({ user: id, channel: channelId });
  const unSubscribedChannel = await Channel.findByIdAndUpdate(
    { _id: channelId },
    { $: { channelCount: -1 } },
    { new: true }
  );
  const data = { channel: unSubscribedChannel };
  return respondWithSuccess(res, 200, 'unsubcribed successfully', data);
});

export const getSubscriptionStatus = catchAsync(async (req, res, next) => {
  const { id } = req.auth;
  const { videoId } = req.params;
  const videoDetails = await Video.findById(videoId).populate('channel');
  if (!videoDetails)
    return respondWithWarning(res, 404, 'no video with the id found');
  const {
    channel: { _id: channelId },
  } = videoDetails;
  const subscription = await Subscriber.findOne({
    user: id,
    channel: channelId,
  });
  if (!subscription)
    return respondWithWarning(res, 404, 'not subcribed to this channel');
  return respondWithSuccess(
    res,
    200,
    'you are subcribed to this channel',
    true
  );
});

export const subscriptionList = catchAsync(async (req, res, next) => {
  const { paginatedResults } = res;
  if (!paginatedResults.data.length)
    return respondWithWarning(res, 404, 'not subscribed to any channel');
  return respondWithSuccess(
    res,
    200,
    'subscription fetched successfully',
    paginatedResults
  );
});

export const channelSubscriptionCountVideo = catchAsync(
  async (req, res, next) => {
    const { videoId } = req.params;
    const videoDetails = await Video.findById(videoId).populate('channel');
    if (!videoDetails)
      return respondWithWarning(res, 404, 'no video with the id found');
    const {
      channel: { _id: channelId },
    } = videoDetails;
    const subscriptionCount = await Subscriber.countDocuments({
      channel: channelId,
    });
    return respondWithSuccess(
      res,
      200,
      'subscription count fetched successfully',
      subscriptionCount
    );
  }
);

export const getUserSubscriptionStatus = catchAsync(async (req, res, next) => {
  const { channelName } = req.params;
  const { id } = req.auth;
  const channel = await Channel.findOne({ name: channelName });
  if (!channelName) return respondWithWarning(res, 404, 'no channel found');
  const { _id: channelId } = channel;
  const subscription = await Subscriber.findOne({
    user: id,
    channel: channelId,
  });
  if (!subscription)
    return respondWithWarning(res, 404, 'not subcribed to this channel');
  return respondWithSuccess(
    res,
    200,
    'you are subcribed to this channel',
    true
  );
});

export const channelSubscriptionCount = catchAsync(async (req, res, next) => {
  const { channelName } = req.params;
  const channel = await Channel.findOne({ name: channelName });
  if (!channelName) return respondWithWarning(res, 404, 'no channel found');
  const { _id: channelId } = channel;
  const channelCount = await Subscriber.countDocuments({ channel: channelId });
  return respondWithSuccess(
    res,
    200,
    'subcriber count fetched successfully',
    channelCount
  );
});

export const getUserSubscriptionsCount = catchAsync(async (req, res, next) => {
  const { id } = req.auth;
  const subscriptionCount = await Subscriber.countDocuments({ user: id });
  return respondWithSuccess(
    res,
    200,
    'subscription count fetched successfully',
    subscriptionCount
  );
});
