import { respondWithWarning } from '../helper/responseHandler';
import Subscriber from '../models/subscribers';

export const getChannelIds = async (req, res, next) => {
  const { id } = req.auth;
  if (!id) return respondWithWarning(res, 401, 'please login to continue');
  const channels = await Subscriber.find({ user: id }).select('channel');
  const channelIds = channels.map((channel) => channel.channel);
  req.channelIds = channelIds;
  next();
};
