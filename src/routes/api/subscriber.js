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
} from '../../controllers/subscriber';
import { checkAuth } from '../../middlewares/auth';
import paginate from '../../middlewares/pagination';
import Subscriber from '../../models/subscribers';

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
subscriber.get('/:videoId', checkAuth, getSubscriptionStatus);
subscriber.get('/channel/count/:channelName', channelSubscriptionCount);
subscriber.get('/count/:videoId', channelSubscriptionCountVideo);

export default subscriber;
