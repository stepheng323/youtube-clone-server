/* eslint-disable no-underscore-dangle */
import { respondWithWarning } from '../helper/responseHandler';
import Subscriber from '../models/subscribers';
import Channel from '../models/channel';

export const getChannelIds = async (req, res, next) => {
  try {
    const { id } = req.auth;
    if (!id) return respondWithWarning(res, 401, 'please login to continue');
    const channels = await Subscriber.find({ user: id }).select('channel');
    const channelIds = channels.map((channel) => channel.channel);
    req.channelIds = channelIds;
    return next();
  } catch (error) {
    next(error);
  }
};

export const getChannelId = async (req, res, next) => {
  try {
    const { channelName } = req.params;
    const channel = await Channel.findOne({ name: channelName });
    if (!channel) return respondWithWarning(res, 404, `no channel found with ${channelName}`);
    req.channelId = channel._id;
    return next();
  } catch (error) {
    next(error);
  }
};
