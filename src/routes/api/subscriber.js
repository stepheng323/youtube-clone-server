import { Router } from 'express';
import {
  subscribeToChannel,
  getSubscriptionStatus,
  subscriptionList,
  unSubscribeFromChannel,
  channelSubscriptionCountVideo,
  getUserSubscriptionsCount,
  getUserSubscriptionStatus,
  channelSubscriptionCount,
  subcriptionsVideos,
} from '../../controllers/subscriber';
import { checkAuth } from '../../middlewares/auth';
import { getChannelIds } from '../../middlewares/channel';
import paginate from '../../middlewares/pagination';
import Subscriber from '../../models/subscribers';
import Video from '../../models/video';

const subscriber = Router();

subscriber.post('/subscribe/:channelId', checkAuth, subscribeToChannel);
subscriber.post('/unsubscribe/:channelId', checkAuth, unSubscribeFromChannel);
subscriber.get(
  '/subscription',
  checkAuth,
  paginate(Subscriber, {}, [], [{ path: 'channel' }], '', 'user'),
  subscriptionList
);
subscriber.get('/status/:channelName', checkAuth, getUserSubscriptionStatus);
subscriber.get('/count', checkAuth, getUserSubscriptionsCount);
subscriber.get('/videos', checkAuth, getChannelIds,
  paginate(Video, {}, [], [], {}), subcriptionsVideos);
subscriber.get('/:videoId', checkAuth, getSubscriptionStatus);
subscriber.get('/channel/count/:channelName', channelSubscriptionCount);
subscriber.get('/count/:videoId', channelSubscriptionCountVideo);
export default subscriber;
